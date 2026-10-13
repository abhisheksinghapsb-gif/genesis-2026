import os
import time
from PIL import Image
import numpy as np
import imageio_ffmpeg
import subprocess

ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
out_dir = 'public/videos'
os.makedirs(out_dir, exist_ok=True)

def process_video(input_path, output_path, patch_fn=None, crop_top=0):
    print(f"\nProcessing {input_path} -> {output_path}...")
    t0 = time.time()
    
    w, h = 1920, 1080
    fps = 24
    frame_bytes = w * h * 3
    
    dec_cmd = [
        ffmpeg, '-i', input_path,
        '-f', 'image2pipe',
        '-pix_fmt', 'rgb24',
        '-vcodec', 'rawvideo', '-'
    ]
    
    enc_cmd = [
        ffmpeg, '-y',
        '-f', 'rawvideo',
        '-vcodec', 'rawvideo',
        '-s', f'{w}x{h}',
        '-pix_fmt', 'rgb24',
        '-r', str(fps),
        '-i', '-',
        '-an',
        '-c:v', 'libx264',
        '-crf', '22',
        '-preset', 'fast',
        '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart',
        output_path
    ]
    
    dec_proc = subprocess.Popen(dec_cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    enc_proc = subprocess.Popen(enc_cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)
    
    count = 0
    while True:
        raw = dec_proc.stdout.read(frame_bytes)
        if len(raw) < frame_bytes:
            break
        
        frame = np.frombuffer(raw, dtype=np.uint8).copy().reshape((h, w, 3))
        
        if patch_fn:
            frame = patch_fn(frame)
            
        if crop_top > 0:
            # Crop top crop_top pixels and scale back to 1080
            im = Image.fromarray(frame)
            im = im.crop((0, crop_top, w, h)).resize((w, h), Image.Resampling.LANCZOS)
            frame = np.array(im)
            
        enc_proc.stdin.write(frame.tobytes())
        count += 1
        
    dec_proc.stdout.close()
    enc_proc.stdin.close()
    dec_proc.wait()
    enc_proc.wait()
    
    mb = os.path.getsize(output_path) / (1024 * 1024)
    dt = time.time() - t0
    print(f"  [OK] Finished {count} frames in {dt:.1f}s. Size: {mb:.2f} MB")

# 1. About: remove top-left arrow, top-right house, and cut-off red sliver
f0_about = np.array(Image.open('public/screenshots/ref_ABou_f0.png'))
f0_about_sky = f0_about[0:45, 20:170]
w_sky = f0_about_sky.shape[1]

def patch_about(frame):
    # Erase top-left back arrow
    frame[0:140, 0:220] = f0_about[0:140, 0:220]
    # Erase top-right house button
    frame[0:140, 1700:1920] = f0_about[0:140, 1700:1920]
    # Erase cut-off red sliver above GENESIS with seamless starry sky
    for x in range(180, 900, w_sky):
        end_x = min(x + w_sky, 900)
        frame[0:45, x:end_x] = f0_about_sky[:, 0:(end_x - x)]
    return frame

# 2. Timeline: remove top-left back arrow and top-right house button
f0_timeline = np.array(Image.open('public/screenshots/ref_time_f0.png'))

def patch_timeline(frame):
    frame[0:130, 0:190] = f0_timeline[0:130, 0:190]
    frame[0:130, 1720:1920] = f0_timeline[0:130, 1720:1920]
    return frame

# 3. Memories: patch corner tabs and seamlessly extend filmstrip
def patch_memories(frame):
    # Left wallpaper from same row (x=200:330)
    frame[0:125, 0:130] = frame[0:125, 200:330]
    # Left filmstrip from below (y=125:250)
    frame[0:125, 130:185] = frame[125:250, 130:185]

    # Right wallpaper from same row (x=1590:1720)
    frame[0:125, 1790:1920] = frame[0:125, 1590:1720]
    # Right filmstrip from below (y=125:250)
    frame[0:125, 1735:1790] = frame[125:250, 1735:1790]
    return frame

# 4. Sponsors: remove top-left back arrow and top-right house button
def patch_sponsors(frame):
    # Erase left back button
    frame[0:138, 0:205] = frame[0:138, 210:415]
    # Erase right home button
    frame[0:138, 1715:1920] = frame[0:138, 1510:1715]
    return frame

if __name__ == '__main__':
    print("=== Starting video patching & re-encoding ===")
    process_video('reference-videos/ABout.mp4', 'public/videos/about-loop.mp4', patch_about, crop_top=15)
    process_video('reference-videos/timeline.mp4', 'public/videos/timeline-loop.mp4', patch_timeline, crop_top=14)
    process_video('reference-videos/memories.mp4', 'public/videos/memories-loop.mp4', patch_memories, crop_top=14)
    process_video('reference-videos/sponser.mp4', 'public/videos/sponsors-loop.mp4', patch_sponsors, crop_top=0)
    process_video('reference-videos/prize pool.mp4', 'public/videos/prizes-loop.mp4', crop_top=50)
    process_video('reference-videos/faqs.mp4', 'public/videos/faqs-loop.mp4', crop_top=45)
    print("\n=== All videos processed successfully! ===")


