from pydantic import BaseModel


class Data(BaseModel):
    name: str
    content: str

    class Config:
        orm_mode = True

class DataOut(BaseModel):
    id: str
    name: str
    content: str

    class Config:
        orm_mode = True


class Message(BaseModel):
    message: str