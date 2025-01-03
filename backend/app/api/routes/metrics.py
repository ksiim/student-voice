from datetime import datetime
from typing import Any, Optional
import uuid
from app import crud
from app.models import (
    Review, Role, SubjectMetricsRequest, SubjectMetricsResponse, User, UserCreate, UserPublic, UsersPublic, Subject, Class, TeacherMetricsRequest, TeacherMetricsResponse
)
from fastapi import APIRouter, HTTPException, Query

from app.api.deps import (
    SessionDep,
)
from sqlalchemy import delete
from sqlmodel import select, func


router = APIRouter()

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select, func

router = APIRouter()

@router.post("/teachers", response_model=list[TeacherMetricsResponse])
async def get_teacher_metrics(
    request: TeacherMetricsRequest,
    session: SessionDep
) -> list[TeacherMetricsResponse]:
    """
    Retrieve teacher metrics.
    """
    teacher_role = (await session.execute(select(Role).where(Role.name == "teacher"))).scalar_one()
    query = select(User).where(User.role_id == teacher_role.id)
    
    if request.teacher_ids:
        query = query.where(User.id.in_(request.teacher_ids))
    
    teachers = (await session.execute(query)).scalars().all()
    
    response = []
    for teacher in teachers:
        # Подсчет метрик для преподавателя
        reviews_query = select(
            func.sum(Review.teaching_quality).label("sum_teaching_quality"),
            func.count(Review.teaching_quality).label("count_teaching_quality"),
            func.sum(Review.material_clarity).label("sum_material_clarity"),
            func.count(Review.material_clarity).label("count_material_clarity")
        ).where(Review.class_id.in_(
            select(Class.id).where(Class.teacher_id == teacher.id)
        ))
        
        reviews_result = (await session.execute(reviews_query)).one()
        
        sum_teaching_quality = reviews_result.sum_teaching_quality or 0
        count_teaching_quality = reviews_result.count_teaching_quality or 1
        sum_material_clarity = reviews_result.sum_material_clarity or 0
        count_material_clarity = reviews_result.count_material_clarity or 1
        
        csat = sum_teaching_quality / count_teaching_quality
        cdsat = sum_material_clarity / count_material_clarity
        csi = (csat + cdsat) / 2
    
        teacher_metrics = {
            "csat": csat,
            "cdsat": cdsat,
            "csi": csi
        }
        
        # Подсчет метрик для предметов
        subjects_query = select(Subject).distinct().join(Class).where(Class.teacher_id == teacher.id)
        subjects = (await session.execute(subjects_query)).scalars().all()
        
        subject_metrics_list = []
        for subject in subjects:
            subject_reviews_query = select(
                func.sum(Review.teaching_quality).label("sum_teaching_quality"),
                func.count(Review.teaching_quality).label("count_teaching_quality"),
                func.sum(Review.material_clarity).label("sum_material_clarity"),
                func.count(Review.material_clarity).label("count_material_clarity")
            ).where(Review.class_id.in_(
                select(Class.id).where(Class.subject_id == subject.id)
            ))
            
            subject_reviews_result = (await session.execute(subject_reviews_query)).one()
            
            sum_teaching_quality = subject_reviews_result.sum_teaching_quality or 0
            count_teaching_quality = subject_reviews_result.count_teaching_quality or 1
            sum_material_clarity = subject_reviews_result.sum_material_clarity or 0
            count_material_clarity = subject_reviews_result.count_material_clarity or 1
            
            csat = sum_teaching_quality / count_teaching_quality
            cdsat = sum_material_clarity / count_material_clarity
            csi = (csat + cdsat) / 2
            
            subject_metrics_list.append({
                "id": subject.id,
                "name": subject.name,
                "metrics": {
                    "csat": csat,
                    "cdsat": cdsat,
                    "csi": csi
                }
            })
        
        response.append({
            "id": teacher.id,
            "full_name": f"{teacher.name} {teacher.surname}",
            "metrics": teacher_metrics,
            "subjects": subject_metrics_list
        })
    
    return response

@router.post("/subjects", response_model=list[SubjectMetricsResponse])
async def get_subject_metrics(
    request: SubjectMetricsRequest,
    session: SessionDep
) -> list[SubjectMetricsResponse]:
    """
    Retrieve subject metrics.
    """
    query = select(Subject)
    
    if request.subject_ids:
        query = query.where(Subject.id.in_(request.subject_ids))
    
    subjects = (await session.execute(query)).scalars().all()
    
    response = []
    for subject in subjects:
        # Подсчет метрик для предмета
        reviews_query = select(
            func.sum(Review.teaching_quality).label("sum_teaching_quality"),
            func.count(Review.teaching_quality).label("count_teaching_quality"),
            func.sum(Review.material_clarity).label("sum_material_clarity"),
            func.count(Review.material_clarity).label("count_material_clarity")
        ).where(Review.class_id.in_(
            select(Class.id).where(Class.subject_id == subject.id)
        ))
        
        reviews_result = (await session.execute(reviews_query)).one()
        
        sum_teaching_quality = reviews_result.sum_teaching_quality or 0
        count_teaching_quality = reviews_result.count_teaching_quality or 1
        sum_material_clarity = reviews_result.sum_material_clarity or 0
        count_material_clarity = reviews_result.count_material_clarity or 1
        
        csat = sum_teaching_quality / count_teaching_quality
        cdsat = sum_material_clarity / count_material_clarity
        csi = (csat + cdsat) / 2
        
        subject_metrics = {
            "csat": csat,
            "cdsat": cdsat,
            "csi": csi
        }
        
        # Подсчет метрик для преподавателей
        teachers_query = select(User).distinct().join(Class).where(Class.subject_id == subject.id)
        teachers = (await session.execute(teachers_query)).scalars().all()
        
        teacher_metrics_list = []
        for teacher in teachers:
            teacher_reviews_query = select(
                func.sum(Review.teaching_quality).label("sum_teaching_quality"),
                func.count(Review.teaching_quality).label("count_teaching_quality"),
                func.sum(Review.material_clarity).label("sum_material_clarity"),
                func.count(Review.material_clarity).label("count_material_clarity")
            ).where(Review.class_id.in_(
                select(Class.id).where(Class.teacher_id == teacher.id)
            ))
            
            teacher_reviews_result = (await session.execute(teacher_reviews_query)).one()
            
            sum_teaching_quality = teacher_reviews_result.sum_teaching_quality or 0
            count_teaching_quality = teacher_reviews_result.count_teaching_quality or 1
            sum_material_clarity = teacher_reviews_result.sum_material_clarity or 0
            count_material_clarity = teacher_reviews_result.count_material_clarity or 1
            
            csat = sum_teaching_quality / count_teaching_quality
            cdsat = sum_material_clarity / count_material_clarity
            csi = (csat + cdsat) / 2
            
            teacher_metrics_list.append({
                "id": teacher.id,
                "full_name": f"{teacher.name} {teacher.surname}",
                "metrics": {
                    "csat": csat,
                    "cdsat": cdsat,
                    "csi": csi
                }
            })
        
        response.append({
            "id": subject.id,
            "name": subject.name,
            "metrics": subject_metrics,
            "teachers": teacher_metrics_list
        })
    
    return response
