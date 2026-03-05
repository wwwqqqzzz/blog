import os
import re

base_dir = r"e:\xiangmu\blog\blog-main\blog\ai"

# We will use regex to find the complex blockquote structures and replace them with the simple format

pattern = re.compile(
    r"> \[!NOTE\] 绘图 Prompt 预留\n> 请将以下指令直接复制给 Midjourney/DALL-E 等图片生成工具。已锁定极简与白底风格：\n> ```text\n> Prompt: (.*?)\n> ```",
    re.DOTALL
)

def update_placeholders():
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if not file.endswith(".md"):
                continue
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()

            if "> [!NOTE] 绘图 Prompt 预留" in content:
                # Replace with the strictly requested format
                new_content = pattern.sub(r"[图片占位:(\1)]", content)
                
                if new_content != content:
                    with open(path, "w", encoding="utf-8") as f:
                        f.write(new_content)
                    print(f"Updated format in: {file}")

update_placeholders()
print("All prompt placeholders reverted to strictly requested simple format.")
