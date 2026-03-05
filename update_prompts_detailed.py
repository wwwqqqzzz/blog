import os

base_dir = r"e:\xiangmu\blog\blog-main\blog\ai"

# 统一限定词：确保绘图 AI 维持极致简约的线框/扁平风格
AESTHETIC_PREFIX = "Prompt: A clean, minimalist technical diagram on a solid white background. Use simple, crisp vector line art, monochrome or with very subtle minimal color accents (like one shade of blue). Flat design, no 3D effects, no clutter. "

mapping_replacements = {
    # 6.1
    "展示Prompt Engineering输入输出原理的简单示意图。": AESTHETIC_PREFIX + "Draw a simple black box representing the AI model. On the left, draw abstract simple text lines entering the box. On the right, draw structured data blocks coming out.",
    "RAG检索增强外挂知识库流程图。": AESTHETIC_PREFIX + "Draw a simple workflow: A user icon points to a database icon (cylinder). An arrow goes from the database to an AI brain icon. Another arrow goes from the AI brain to an output text document.",
    "Fine-Tuning模型微调修改底层参数的简明示意图。": AESTHETIC_PREFIX + "Draw a minimal brain icon or neural network node structure. Draw a simple wrench or gear icon adjusting the connections, representing the subtle modification of internal weights.",
    
    # 6.2
    "预训练(Pre-Training)中预测下一个词的训练连线图。": AESTHETIC_PREFIX + "Draw a sequence of empty rectangular boxes representing words. An arrow from the first few boxes points to a highlighted empty box at the end, representing predicting the next word in a sequence.",
    "SFT有监督微调标准问答格式示意图。": AESTHETIC_PREFIX + "Draw a simple document split into two sections: 'Q' (Question) and 'A' (Answer). An arrow points from this document into a simple robot head icon.",
    
    # 6.3
    "LoRA低秩微调旁路矩阵相加的架构图。": AESTHETIC_PREFIX + "Draw a large rectangle representing a frozen matrix. Next to it, draw two much smaller, thin rectangles connected in a V-shape or sequence, representing low-rank matrices. Arrows combine the output of both into a final single line.",
    "LoRA模块即插即用的简单示意图。": AESTHETIC_PREFIX + "Draw a main central hub or block. Draw several small, distinct cartridge-like blocks that look like they can plug into the main hub. Minimalist vector style.",

    # 6.4
    "RLHF人类反馈强化学习三大步骤流程图。": AESTHETIC_PREFIX + "Draw three simple stages connected by arrows: 1. A human eye or person icon evaluating two text boxes. 2. A simple robot icon with a crown (reward model). 3. The reward model guiding another robot.",
    "DPO偏好优化的极简逻辑说明图。": AESTHETIC_PREFIX + "Draw a simple balance scale. On one side is a document with a checkmark (preferred), on the other side a document with an X (rejected).",
    
    # 7.1
    "从FP16到INT8量化映射的直观原理图。": AESTHETIC_PREFIX + "Draw a long ruler with many fine gradient ticks representing high precision. Below it, draw a much shorter ruler with only a few coarse blocking ticks, showing the mapping from fine to coarse precision.",
    "混合精度量化中保护高权重异常点的策略图。": AESTHETIC_PREFIX + "Draw a grid of squares. Most squares are shaded light grey. A few isolated scattered squares are shaded bright solid blue or outlined specifically, representing protected high-weight outliers.",
    
    # 7.2
    "生成文本时KV Cache显存消耗随长度增加的趋势图。": AESTHETIC_PREFIX + "Draw a simple 2D line graph. The X-axis is sequence length, the Y-axis is Memory Usage. Draw a cleanly rising line or a series of increasing simple bar charts.",
    "PagedAttention显存分页机制的简单对比图。": AESTHETIC_PREFIX + "Divide the image into two sections. Left side: a single long contiguous block of memory. Right side: memory broken into many small, distinct identical square blocks (pages) with connecting lines.",

    # 7.3
    "算子融合(Kernel Fusion)减少显存读写的原理图。": AESTHETIC_PREFIX + "Draw three separate small boxes merging into a single, larger unified box. Arrows show data bypassing intermediate saves and going straight through the unified box.",
    "投机采样(Speculative Decoding)大小模型配合工作流。": AESTHETIC_PREFIX + "Draw a small simple icon generating a sequence of small blocks. Above it, a larger icon is checking those blocks simultaneously with a scanning beam.",

    # 8.1
    "视觉像素与文本词向量的模态差异对比图。": AESTHETIC_PREFIX + "Draw a grid of pixels on the left. On the right, draw an abstract scatter plot or coordinate system with text nodes. A broken line or barrier sits between them.",
    "CLIP模型双编码器图文对比原理图。": AESTHETIC_PREFIX + "Draw two funnels: one takes an image icon, the other a text document. Their outputs (arrows) point towards a central shared circle or space where they align.",
    "多模态大语言模型(VLM)三段拼接架构图。": AESTHETIC_PREFIX + "Draw three distinct blocks in a sequence: a camera icon, a simple bridge connector block, and a large brain icon. Straight arrows connect them left to right.",

    # 8.2
    "扩散模型(Diffusion)加噪去噪纯净版流程图。": AESTHETIC_PREFIX + "Draw a clean image icon progressively degrading into scattered dots (noise) moving right, then a U-shape arrow curving back left mapping the dots back into the clean image.",
    "Latent Diffusion潜空间架构图。": AESTHETIC_PREFIX + "Draw a large square shrinking into a tiny square. The tiny square goes through a loop, then expands back into a large square. Minimalist style.",
    "DiT视频模型时空Patch区块处理架构图。": AESTHETIC_PREFIX + "Draw a film strip or series of frames cut into a grid of tiny square patches. These patches flow into an abstract Transformer network block.",

    # 9.1
    "模型多学科打分的极简雷达图。": AESTHETIC_PREFIX + "Draw a simple, clean minimalist radar chart (spider chart) with 6 axes. Use simple lines and one subtle fill color. No complex background.",
    "大模型充当裁判的自动评估工作流。": AESTHETIC_PREFIX + "Draw two AI model boxes outputting text to a central, larger AI model acting as a judge (holding a gavel), which outputs a single score.",
    "盲测对战与Elo积分看板的示意图。": AESTHETIC_PREFIX + "Draw two anonymous masked figures presenting answers. A voting box sits in the middle. Next to it, draw a simple leaderboard table with scores."
}

def update_placeholders():
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if not file.endswith(".md"):
                continue
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()

            modified = False
            for short_desc, detailed_prompt in mapping_replacements.items():
                old_str = f"[图片占位: Prompt: 极简风格，线条简单，{short_desc}]"
                
                # We format it beautifully in a Markdown blockquote and code block for one-click copy
                new_str = f"> [!NOTE] 绘图 Prompt 预留\n> 请将以下指令直接复制给 Midjourney/DALL-E 等图片生成工具。已锁定极简与白底风格：\n> ```text\n> {detailed_prompt}\n> ```"
                
                if old_str in content:
                    content = content.replace(old_str, new_str)
                    modified = True
                    
            if modified:
                with open(path, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"Updated placeholders in: {file}")

update_placeholders()
print("All prompt placeholders updated to detailed english.")
