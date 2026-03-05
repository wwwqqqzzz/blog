import os
import re

base_dir = r"e:\xiangmu\blog\blog-main\blog\ai"

# 抓取原始的图床或本地 markdown 图片
old_image_pattern = re.compile(r"!\[.*?\]\([^\)]+\)")

# 我们统一的替换极简占位符
simplified_prompt = "[图片占位:(A clean, minimalist technical diagram on a solid white background. Use simple, crisp vector line art, monochrome or with very subtle minimal color accents. Flat design, no 3D effects, no clutter. Abstract visual.)]"

modified_files = 0

def purge_images():
    global modified_files
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if not file.endswith(".md"):
                continue
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            
            # 检查是否有匹配项
            if old_image_pattern.search(content):
                # 用新的极简 prompt 盖掉
                new_content = old_image_pattern.sub(simplified_prompt, content)
                
                with open(path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"Purged old images in: {os.path.relpath(path, base_dir)}")
                modified_files += 1

print("Starting deep purge of outdated image syntax across all AI stages...")
purge_images()
print(f"Purge complete. Super clean now. Modified {modified_files} files.")
