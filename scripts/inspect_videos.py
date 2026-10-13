import os
import imageio.v2 as iio
from PIL import Image

out_dir = 'reference-videos/frames'
os.makedirs(out_dir, exist_ok=True)
files = ['homepage.mp4', 'ABout.mp4', 'timeline.mp4', 'prize pool.mp4', 'sponser.mp4', 'memories.mp4', 'faqs.mp4']

for f in files:
    path = os.path.join('reference-videos', f)
    print(f'=== {f} ===')
    try:
        reader = iio.get_reader(path, 'ffmpeg')
        meta = reader.get_meta_data()
        fps = meta.get('fps', 30)
        duration = meta.get('duration', 0)
        size = meta.get('size', (0, 0))
        nframes = reader.count_frames()
        print(f'FPS: {fps}, Duration: {duration}s, Size: {size}, Frame count: {nframes}')

        # Save frames at 0s, 1s, 2s, 4s, 7s
        safe_name = f.replace(' ', '_').replace('.mp4', '')
        sample_indices = [0, int(fps * 1), int(fps * 2), int(fps * 4), min(int(fps * 7), nframes - 1)]
        for idx in sample_indices:
            try:
                frame = reader.get_data(idx)
                img = Image.fromarray(frame)
                frame_path = os.path.join(out_dir, f'{safe_name}_f{idx}.jpg')
                img.save(frame_path)
                print(f'  Saved frame {idx} -> {frame_path}')
            except Exception as fe:
                print(f'  Error getting frame {idx}: {fe}')
        reader.close()
    except Exception as e:
        print(f'Error reading {f}: {e}')
