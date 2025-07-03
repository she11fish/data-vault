from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

def save_text_as_pdf(text, filename="output.pdf"):
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter

    c.setFont("Helvetica", 10)

    text_object = c.beginText(40, height - 40)
    text_object.setFont("Helvetica", 10)
    text_object.setTextOrigin(40, height - 40)


    lines = text.split("\n")
    for line in lines:
        text_object.textLine(line)

    c.drawText(text_object)
    c.save()


if __name__ == "__main__":
  text = """This is an example text that will be saved as a PDF."""
  save_text_as_pdf(text, "output.pdf")
