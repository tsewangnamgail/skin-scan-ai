# ============================================================
# app/rag/agent.py
# ============================================================
from langchain.agents import AgentExecutor, create_react_agent
from langchain.tools import Tool
from langchain import hub
from langchain_core.prompts import PromptTemplate
from app.rag.groq_client import get_groq_llm
from app.rag.retriever import get_retriever
from app.core.logger import logger

_agent = None


def _rag_search(query: str) -> str:
    retriever = get_retriever(k=4)
    docs = retriever.invoke(query)
    if not docs:
        return "No relevant information found in the knowledge base."
    context = "\n\n".join([doc.page_content for doc in docs])
    return context


def get_rag_agent():
    global _agent
    if _agent is not None:
        return _agent

    llm = get_groq_llm()

    tools = [
        Tool(
            name="SkinCancerKnowledgeBase",
            func=_rag_search,
            description=(
                "Use this tool to search for information about skin cancer, "
                "dermatology, skin lesions, melanoma, and related medical topics. "
                "Input should be a search query related to skin cancer."
            ),
        ),
    ]

    prompt_template = """You are a helpful medical AI assistant specializing in dermatology and skin cancer.
You have access to the following tools:

{tools}

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

If the question is about skin cancer, dermatology, or related medical topics, use the SkinCancerKnowledgeBase tool to find relevant information.
If the question is general or you can answer it from your training knowledge, provide a direct answer.
Always provide accurate, helpful, and medically responsible information.
Include a disclaimer that your advice should not replace professional medical consultation.

Begin!

Question: {input}
Thought: {agent_scratchpad}"""

    prompt = PromptTemplate(
        template=prompt_template,
        input_variables=["input", "agent_scratchpad"],
        partial_variables={
            "tools": "\n".join(
                [f"{tool.name}: {tool.description}" for tool in tools]
            ),
            "tool_names": ", ".join([tool.name for tool in tools]),
        },
    )

    agent = create_react_agent(llm=llm, tools=tools, prompt=prompt)

    _agent = AgentExecutor(
        agent=agent,
        tools=tools,
        verbose=True,
        handle_parsing_errors=True,
        max_iterations=5,
        return_intermediate_steps=False,
    )

    logger.info("RAG agent created successfully")
    return _agent