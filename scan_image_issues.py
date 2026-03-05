import os
import re

base_dir = r"e:\xiangmu\blog\blog-main\blog\ai"

# Regex for old markdown local images: ![image-xxxxx](./assets/...)
old_image_pattern = re.compile(r"!\[.*?\]\(.*?\)")

# Regex for Chinese prompts or prompts with markdown formatting we just removed:
chinese_prompt_pattern = re.compile(r"\[图片占位: Prompt: .*?\]|\[图片占位:\(.*?[\u4e00-\u9fa5].*?\)\]")

def scan_issues():
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if not file.endswith(".md"):
                continue
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
                
            old_images = old_image_pattern.findall(content)
            bad_prompts = chinese_prompt_pattern.findall(content)
            
            if old_images or bad_prompts:
                print(f"\n--- [ISSUE FOUND IN]: {os.path.relpath(path, base_dir)} ---")
                if old_images:
                    print(f"  > Found {len(old_images)} outdated local image tags format: {old_images[0][:50]}...")
                if bad_prompts:
                    print(f"  > Found {len(bad_prompts)} non-compliant or Chinese prompt tags: {bad_prompts[0][:50]}...")

scan_issues()
