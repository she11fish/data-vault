from PIL import Image, ImageFilter
import pytesseract
import re
import io

def image_to_text(files_content: bytes):
    img = Image.open(io.BytesIO(files_content))

    img = img.convert("L")

    img = img.point(lambda p: p > 128 and 255)

    img = img.filter(ImageFilter.MedianFilter())

    text = pytesseract.image_to_string(img)
    text = re.sub(r'(?<=D\.)\n\n', ' ', text)

    d_position = text.find('D.')
    if d_position != -1:
        newline_position = text.find('.', d_position + 2)
        if newline_position != -1:
            text = text[:newline_position + 1]

    print(text)
    return text