import os
import re

mapping = {
    # 3
    "3.1 基础心法：角色设定与上下文学习.md": "3.1 提示工程基础：角色设定与上下文学习.md",
    "3.2 深度思维：榨取逻辑极限的进阶技巧.md": "3.2 进阶提示工程：CoT链式思考与多路径推理.md",
    "3.3 工程防御：结构化输出与安全边界.md": "3.3 工程化提示：结构化输出规范与安全防御.md",
    
    # 4
    "4.2 RAG基础架构：从切分到混合检索.md": "4.2 RAG基础架构：文档切分与混合检索机制.md",
    "4.3 RAG进阶路线：召回黑科技与长文本博弈.md": "4.3 RAG进阶路线：高级检索策略与长文本模型对比.md",
    "4.4 前沿探索：RAG的专职评估与知识图谱重塑.md": "4.4 RAG效果评估模型与知识图谱(GraphRAG)展望.md",

    # 5
    "5.1 基础引擎：ReAct与ToolCalling.md": "5.1 Agent基础原理：ReAct架构与工具调用.md",
    "5.2 认知架构：记忆管理与自主规划.md": "5.2 Agent认知架构：系统记忆管理与复杂任务规划.md",
    "5.3 前沿物种：多Agent协作与物理具身.md": "5.3 Agent前沿发展：多智能体协作与系统控制.md",

    # 6
    "6.1 定制化之争：Prompt、RAG与微调的三岔路口.md": "6.1 模型定制选型：Prompt、RAG与微调边界对比.md",
    "6.2 炼丹炉纪元：从预训练到SFT指令微调.md": "6.2 大模型训练管线：预训练基座与SFT有监督微调.md",
    "6.3 穷人的法拉利：LoRA参数高效微调解析.md": "6.3 参数高效微调：LoRA原理与实践解析.md",
    "6.4 对齐人类价值观：RLHF与DPO算法进化路.md": "6.4 价值观对齐验证：RLHF与DPO算法原理.md",

    # 7
    "7.1 显存吃紧的救星：模型量化算法与原理.md": "7.1 模型部署显存优化：量化算法原理(INT8-INT4).md",
    "7.2 突破推理显存瓶颈：KVCache与vLLM的显存魔法.md": "7.2 推理速度与显存管理：KV Cache与vLLM架构.md",
    "7.3 极致榨取算力：企业级黑科技与部署工具链.md": "7.3 企业级推理加速：核心底层优化与主流部署框架.md",

    # 8
    "8.1 跨越文本的壁垒：多模态巨兽的核心架构原理.md": "8.1 视觉与文本融合：多模态大模型(VLM)架构解析.md",
    "8.2 从扩散到物理引擎：Sora与视频生成的暴力美学.md": "8.2 视频生成核心技术：从扩散模型到DiT架构.md",
    "8.2 从扩散到物理引擎：视频生成原理剖析.md": "8.2 视频生成核心技术：从扩散模型到DiT架构.md",

    # 9
    "9.1 大牌对决的裁判席：LLM评估体系面面观.md": "9.1 大语言模型评估体系：常见基准测试与盲测竞技场.md",
    "9.1 LLM评估体系：机器如何评判机器.md": "9.1 大语言模型评估体系：常见基准测试与盲测竞技场.md"
}

base_dir = r"e:\xiangmu\blog\blog-main\blog\ai"

def update_file_title(filepath, new_filename):
    title_str = new_filename.replace(".md", "")
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # regex update title
    content = re.sub(r"^title:\s*.*$", f"title: {title_str}", content, flags=re.MULTILINE)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

for root, dirs, files in os.walk(base_dir):
    for filename in files:
        if filename in mapping:
            old_path = os.path.join(root, filename)
            new_filename = mapping[filename]
            new_path = os.path.join(root, new_filename)

            # update title inside
            update_file_title(old_path, new_filename)

            # rename
            try:
                os.rename(old_path, new_path)
                print(f"Renamed: {filename} -> {new_filename}")
            except Exception as e:
                print(f"Failed to rename {filename}: {e}")

# now update task.md and implementation_plan.md
def find_and_replace_in_file(filepath):
    if not os.path.exists(filepath):
        return
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    for old_name, new_name in mapping.items():
        content = content.replace(old_name, new_name)
        # Also replace without .md suffix just in case
        content = content.replace(old_name.replace(".md", ""), new_name.replace(".md", ""))
        
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
        
find_and_replace_in_file(os.path.join(os.path.dirname(base_dir), "brain", "9b0c317e-53ba-44f7-9675-401771ab2242", "task.md"))
find_and_replace_in_file(os.path.join(os.path.dirname(base_dir), "brain", "9b0c317e-53ba-44f7-9675-401771ab2242", "implementation_plan.md"))

print("Title updates and renames complete. Metadata updated.")
