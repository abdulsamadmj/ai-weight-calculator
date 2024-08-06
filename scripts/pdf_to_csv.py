# scripts/pdf_to_csv.py
import fitz  # PyMuPDF
import pandas as pd
import sys
import os

def pdf_to_csv(pdf_path, output_path):
    try:
        doc = fitz.open(pdf_path)
        data = []

        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text = page.get_text("text")
            data.extend(text.splitlines())

        df = pd.DataFrame(data, columns=["text"])
        df.to_csv(output_path, index=False)
        print(f"CSV file created at {output_path}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    pdf_path = sys.argv[1]
    output_path = sys.argv[2]
    pdf_to_csv(pdf_path, output_path)
