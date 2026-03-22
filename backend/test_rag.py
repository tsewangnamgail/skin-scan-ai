import asyncio
import traceback
from app.services.rag_chat_service import chat_with_rag
from app.rag.vector_store import initialize_vector_store

async def main():
    try:
        initialize_vector_store()
        res = await chat_with_rag("What is melanoma?")
        print(res)
    except Exception as e:
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
