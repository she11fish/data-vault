import asyncio
import concurrent.futures
from fastapi import APIRouter, Depends, HTTPException, Response, UploadFile
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.data import Data as DataModel
import app.schemas.data as data_schema
from app.api.deps import get_current_user
from app.models.user import User
from app.utils.convert import create_PDF
from app.utils.image_text import image_to_text

router = APIRouter(prefix="/data", tags=["data"])

@router.get("/{id}", response_model=data_schema.DataOut)
async def get_data(id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    data = db.query(DataModel).filter(DataModel.user_id == current_user.id).filter(DataModel.id == id).first()
    return data
    
@router.get("/", response_model=list[data_schema.DataOut])
async def get_all_data(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    data = db.query(DataModel).filter(DataModel.user_id == current_user.id).all()
    return data

@router.get('/convert/{file_id}')
async def get_pdf(file_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    loop = asyncio.get_running_loop()
    file = db.query(DataModel).filter(DataModel.user_id == current_user.id).filter(DataModel.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    with concurrent.futures.ThreadPoolExecutor() as pool:
        out = await loop.run_in_executor(pool, create_PDF, file.content)
    headers = {'Content-Disposition': f'inline; filename="{file.name}.pdf"'}
    return Response(bytes(out), headers=headers, media_type='application/pdf')

@router.post('/image', response_model=data_schema.DataOut)
async def create_image(file: UploadFile, name: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    text = image_to_text(file.file.read())
    db_data = DataModel(name=name, content=text, user_id=current_user.id)
    db.add(db_data)
    db.commit()
    db.refresh(db_data)
    return db_data

@router.post("/", response_model=data_schema.DataOut)
async def create_data(data: data_schema.Data, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_data = DataModel(name=data.name, content=data.content, user_id=current_user.id)
    db.add(db_data)
    db.commit()
    db.refresh(db_data)
    return db_data

@router.delete("/{id}", response_model=data_schema.Message)
async def delete_data(id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    data = db.query(DataModel).filter(DataModel.user_id == current_user.id).filter(DataModel.id == id).first()
    if not data:
        raise HTTPException(status_code=404, detail="Data not found")
    db.delete(data)
    db.commit()
    return {"message": "Data deleted successfully"}

@router.delete("/", response_model=data_schema.Message)
async def delete_all_data(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    data = db.query(DataModel).filter(DataModel.user_id == current_user.id)
    db.delete(data)
    db.commit()
    return {"message": "Data deleted successfully"}
