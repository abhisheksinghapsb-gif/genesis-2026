import os
import subprocess
import imageio_ffmpeg

ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
out_dir = 'public/videos'
os.makedirs(out_dir, exist_ok=True)

video_map = {
    'homepage.mp4': 'hero-loop.mp4',
    'ABout.mp4': 'about-loop.mp4',
    'timeline.mp4': 'timeline-loop.mp4',
    'prize pool.mp4': 'prizes-loop.mp4',
    'sponser.mp4': 'sponsors-loop.mp4',
    'memories.mp4': 'memories-loop.mp4',
    'faqs.mp4': 'faqs-loop.mp4',
}

for src_name, dst_name in video_map.items():
    src_path = os.path.join('reference-videos', src_name)
    dst_path = os.path.join(out_dir, dst_name)
    
    print(f'Compressing {src_name} -> {dst_name}...')
    cmd = [
        ffmpeg, '-y',
        '-i', src_path,
        '-an',
        '-c:v', 'libx264',
        '-crf', '24',
        '-preset', 'medium',
        '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart',
        dst_path
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        size_mb = os.path.getsize(dst_path) / (1024 * 1024)
        print(f'  [OK] Success! Size: {size_mb:.2f} MB')
    else:
        print(f'  [ERR] Error on {src_name}: {res.stderr[-300:]}')

print('All reference videos optimized successfully!')
