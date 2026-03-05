import os
import re

base_dir = r"e:\xiangmu\blog\blog-main\blog\ai"

SIMPLE_PREFIX = "Prompt: 极简风格，线条简单，"

mapping_replacements = {
    # 6.1
    "一张图看懂Prompt Engineering的黑盒输入边界": SIMPLE_PREFIX + "展示Prompt Engineering输入输出原理的简单示意图。",
    "RAG架构原理图：外挂向量数据库与LLM的交互流程": SIMPLE_PREFIX + "RAG检索增强外挂知识库流程图。",
    "模型微调(Fine-Tuning)重塑底座参数原理图": SIMPLE_PREFIX + "Fine-Tuning模型微调修改底层参数的简明示意图。",
    
    # 6.2
    "预训练(Pre-Training)阶段，模型通过海量文本进行下一个词预测的原理图": SIMPLE_PREFIX + "预训练(Pre-Training)中预测下一个词的训练连线图。",
    "监督微调(SFT)阶段，高质量问答标注数据对模型行为塑形的示意图": SIMPLE_PREFIX + "SFT有监督微调标准问答格式示意图。",
    
    # 6.3
    "LoRA 低秩适配微调原理图，展示冻结的预训练大矩阵与旁路小矩阵相乘后相加的过程": SIMPLE_PREFIX + "LoRA低秩微调旁路矩阵相加的架构图。",
    "轻量级 LoRA 文件即插即用挂载在基础模型之上的模块化图文界面示例": SIMPLE_PREFIX + "LoRA模块即插即用的简单示意图。",

    # 6.4
    "RLHF训练三大步骤精简示意图：评注语料收集 -> 训练奖励模型 -> PPO强化学习反馈闭环": SIMPLE_PREFIX + "RLHF人类反馈强化学习三大步骤流程图。",
    "DPO直接偏好优化原理对比图：展示抛弃沉重的打分模型，直接在数学层面上更新生成概率的极简流程": SIMPLE_PREFIX + "DPO偏好优化的极简逻辑说明图。",
    
    # 7.1
    "FP16 浮点数向 INT8 整数进行有损量化缩放映射(Scale Mapping)的数学换算示意图": SIMPLE_PREFIX + "从FP16到INT8量化映射的直观原理图。",
    "AWQ 等高级量化策略在面对高权重异常点(Outliers)时采用的混合精度保护机制图解": SIMPLE_PREFIX + "混合精度量化中保护高权重异常点的策略图。",
    
    # 7.2
    "LLM 自回归生成流程中的显存变化趋势图，直观展现不同长度对话对应 KV Cache 惊人的体量膨胀": SIMPLE_PREFIX + "生成文本时KV Cache显存消耗随长度增加的趋势图。",
    "vLLM PagedAttention 原理图：对比传统连续显存预留，展示打碎后的页映射机制与 Copy-on-Write 内存共享": SIMPLE_PREFIX + "PagedAttention显存分页机制的简单对比图。",

    # 7.3
    "硬件底层的算子融合(Kernel Fusion)流程展示：说明细碎运算步骤如何被打成单一显存调度的集合体": SIMPLE_PREFIX + "算子融合(Kernel Fusion)减少显存读写的原理图。",
    "投机采样(Speculative Decoding)架构执行动效流图：小模型快速起草 + 大模型并行审核打分": SIMPLE_PREFIX + "投机采样(Speculative Decoding)大小模型配合工作流。",

    # 8.1
    "一张图看懂视觉与文本的模态不互通：展示从像素 RGB 矩阵到自然语言 Embedding 坐标系的根本数据形式差异": SIMPLE_PREFIX + "视觉像素与文本词向量的模态差异对比图。",
    "CLIP 模型的双编码器架构与图文对比学习机制(Contrastive Learning)的点积聚类原理示意图": SIMPLE_PREFIX + "CLIP模型双编码器图文对比原理图。",
    "当今主流多模态大语言模型(VLM)的三段式经典架构图：视觉塔(Vision Encoder) + 投影头(Projector) + 大语言模型基座(LLM Backbone)": SIMPLE_PREFIX + "多模态大语言模型(VLM)三段拼接架构图。",

    # 8.2
    "图像扩散(Diffusion)生成过程中的马尔科夫加噪与 U-Net 网络逆向去噪链条示意图": SIMPLE_PREFIX + "扩散模型(Diffusion)加噪去噪纯净版流程图。",
    "Latent Diffusion (潜扩散) 模型核心架构：展示编码器 VAE 降维压缩、潜空间 U-Net 高速去噪与解码器重构的过程": SIMPLE_PREFIX + "Latent Diffusion潜空间架构图。",
    "DiT (Diffusion Transformer) 视频架构图：展示将视频按时空双维度切分为 Patch(补丁)，并交由 Transformer 注意力机制统一处理的工作流": SIMPLE_PREFIX + "DiT视频模型时空Patch区块处理架构图。",

    # 9.1
    "以雷达图形式呈现的多维度静态基准测试(MMLU/HumanEval等)打分雷达图示例": SIMPLE_PREFIX + "模型多学科打分的极简雷达图。",
    "LLM-as-a-Judge 自动化评估流程流图：展示将多个待测模型文本并行输入给GPT-4裁判引擎进行维度评分与裁决的逻辑闭环": SIMPLE_PREFIX + "大模型充当裁判的自动评估工作流。",
    "LMSYS Chatbot Arena 盲测对战平台的用户盲选界面截图，与基于 Elo 积分系统的天梯排行榜动态结构图": SIMPLE_PREFIX + "盲测对战与Elo积分看板的示意图。"
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
            for short_desc, full_prompt in mapping_replacements.items():
                old_str = f"[图片占位: {short_desc}]"
                new_str = f"[图片占位: {full_prompt}]"
                if old_str in content:
                    content = content.replace(old_str, new_str)
                    modified = True
                    
            if modified:
                with open(path, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"Updated placeholders in: {file}")

update_placeholders()
print("All prompt placeholders updated.")
