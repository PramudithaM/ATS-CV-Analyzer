import fitz  # PyMuPDF
from docx import Document

def extract_text(file_bytes: bytes, filename: str) -> str:
    """PDF Or DOCX file text extracting"""
    
    if filename.endswith(".pdf"):
        # PDF extract
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        return text.strip()
    
    elif filename.endswith(".docx"):
        # DOCX extract
        import io
        doc = Document(io.BytesIO(file_bytes))
        text = "\n".join([para.text for para in doc.paragraphs])
        return text.strip()
    
    else:
        raise ValueError("PDF Or DOCX file Only supported")