import os
import re
import sys

def fix_encoding_in_file(file_path):
    """Fix encoding issues in a single file."""
    try:
        # Try to read the file with different encodings
        content = None
        encodings = ['utf-8', 'latin1', 'cp1252', 'gbk', 'gb2312', 'gb18030']

        for encoding in encodings:
            try:
                with open(file_path, 'r', encoding=encoding) as f:
                    content = f.read()
                break
            except UnicodeDecodeError:
                continue

        if content is None:
            print(f"Could not decode {file_path} with any of the attempted encodings.")
            return False

        # Check if the file contains encoding issues
        if '�' not in content:
            return False

        # Replace common encoding issues
        fixed_content = content

        # Directory structure replacements
        directory_structure_replacements = {
            '�?  �?              ├── controller': '│  │              ├── controller',
            '�?  ├── java': '│  ├── java',
            '�?  �?  └── com': '│  │  └── com',
            '�?  �?      └── example': '│  │      └── example',
            '�?  �?          └── logindemo': '│  │          └── logindemo',
            '�?  �?              ├── controller': '│  │              ├── controller',
            '�?  �?              �?  └── LoginController.java': '│  │              │  └── LoginController.java',
            '�?  �?              └── LoginDemoApplication.java': '│  │              └── LoginDemoApplication.java',
            '�?  └── resources': '│  └── resources',
            '�?      ├── static': '│      ├── static',
            '�?      ├── templates': '│      ├── templates',
            '�?      �?  ├── login.html': '│      │  ├── login.html',
            '�?      �?  ├── login-success.html': '│      │  ├── login-success.html',
            '�?      �?  └── login-failure.html': '│      │  └── login-failure.html',
            '�?      └── application.properties': '│      └── application.properties',
        }

        # Common text content replacements
        text_content_replacements = {
            '开�?': '开发',
            '�?/a>': '</a>',
            '用户�?': '用户名',
            '密码错误，请重试�?': '密码错误，请重试。',
            '返回登录�?': '返回登录页',
            '文件�?': '文件。',
            '运行�?': '运行。',
            '访�?': '访问',
            '配置项目信息**�?': '配置项目信息**：',
            '添加依赖**�?': '添加依赖**：',
            'IDEA�?': 'IDEA。',
            'Project`�?': 'Project`。',
            'Initializr`�?': 'Initializr`。',
            '项目设置�?': '项目设置。',
            '�?在本指南中': '在本指南中',
            '功能�?': '功能。',
            '页面�?': '页面。',
        }

        # Apply directory structure replacements
        for old, new in directory_structure_replacements.items():
            fixed_content = fixed_content.replace(old, new)

        # Apply text content replacements
        for old, new in text_content_replacements.items():
            fixed_content = fixed_content.replace(old, new)

        # Fix code blocks with directory structures
        if '```cmd' in fixed_content or '```' in fixed_content:
            # Find all code blocks
            code_blocks = re.findall(r'```.*?```', fixed_content, re.DOTALL)
            for code_block in code_blocks:
                # Replace � characters in code blocks with │
                fixed_code_block = code_block.replace('�?', '│')
                fixed_content = fixed_content.replace(code_block, fixed_code_block)

        # Generic replacement for remaining �? patterns
        fixed_content = re.sub(r'�\?', '', fixed_content)

        # If no changes were made, return
        if fixed_content == content:
            return False

        # Write the fixed content back to the file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(fixed_content)

        return True

    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def scan_directory(directory):
    """Scan a directory for markdown files and fix encoding issues."""
    fixed_files = 0
    total_files = 0

    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                total_files += 1

                if fix_encoding_in_file(file_path):
                    fixed_files += 1
                    print(f"Fixed encoding issues in: {file_path}")

    return fixed_files, total_files

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python fix_encoding.py <directory_or_file>")
        sys.exit(1)

    path = sys.argv[1]

    if os.path.isdir(path):
        print(f"Scanning directory: {path}")
        fixed_files, total_files = scan_directory(path)

        print(f"\nSummary:")
        print(f"Total files scanned: {total_files}")
        print(f"Files with fixed encoding: {fixed_files}")
    elif os.path.isfile(path) and path.endswith('.md'):
        print(f"Processing file: {path}")
        if fix_encoding_in_file(path):
            print(f"Fixed encoding issues in: {path}")
        else:
            print(f"No encoding issues found or could not fix: {path}")
    else:
        print(f"Error: {path} is not a valid directory or markdown file.")
        sys.exit(1)
