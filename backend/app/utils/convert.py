from fpdf import FPDF

def create_PDF(text):
    pdf = FPDF()
    pdf.add_page()
    # Use a clean, readable font and a reasonable size
    pdf.set_font('Arial', '', 12)
    # Set a margin for aesthetics
    left_margin = 15
    right_margin = 15
    top_margin = 20
    pdf.set_left_margin(left_margin)
    pdf.set_right_margin(right_margin)
    pdf.set_top_margin(top_margin)
    pdf.set_auto_page_break(auto=True, margin=20)
    # Add a title for a nice look
    pdf.set_font('Arial', 'B', 14)
    pdf.cell(0, 10, 'Converted Text', ln=True, align='C')
    pdf.ln(10)
    # Set font for body text
    pdf.set_font('Arial', '', 12)
    # Use multi_cell to handle long text and line breaks
    pdf.multi_cell(0, 8, text)
    return pdf.output(dest='S')
