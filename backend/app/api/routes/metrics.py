from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from typing import Any, Optional
import uuid
from app import crud
from app.models import (
    Review, Role, SubjectBasedMetricsReportRequest, SubjectMetricsRequest, SubjectMetricsResponse, TeacherBasedMetricsReportRequest, User, UserCreate, UserPublic, UsersPublic, Subject, Class, TeacherMetricsRequest, TeacherMetricsResponse
)
from fastapi import APIRouter, HTTPException, Query

from app.api.deps import (
    SessionDep,
)
from fastapi.responses import StreamingResponse
from sqlalchemy import delete
from sqlmodel import select, func
import io
import pandas as pd
from urllib.parse import quote


router = APIRouter()


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
            func.count(Review.teaching_quality).label(
                "count_teaching_quality"),
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
        subjects_query = select(Subject).distinct().join(
            Class).where(Class.teacher_id == teacher.id)
        subjects = (await session.execute(subjects_query)).scalars().all()

        subject_metrics_list = []
        for subject in subjects:
            subject_reviews_query = select(
                func.sum(Review.teaching_quality).label(
                    "sum_teaching_quality"),
                func.count(Review.teaching_quality).label(
                    "count_teaching_quality"),
                func.sum(Review.material_clarity).label(
                    "sum_material_clarity"),
                func.count(Review.material_clarity).label(
                    "count_material_clarity")
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
            func.count(Review.teaching_quality).label(
                "count_teaching_quality"),
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
        teachers_query = select(User).distinct().join(
            Class).where(Class.subject_id == subject.id)
        teachers = (await session.execute(teachers_query)).scalars().all()

        teacher_metrics_list = []
        for teacher in teachers:
            teacher_reviews_query = select(
                func.sum(Review.teaching_quality).label(
                    "sum_teaching_quality"),
                func.count(Review.teaching_quality).label(
                    "count_teaching_quality"),
                func.sum(Review.material_clarity).label(
                    "sum_material_clarity"),
                func.count(Review.material_clarity).label(
                    "count_material_clarity")
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


@router.post("/excel/teacher_based")
async def generate_teacher_based_metrics_report(
    request: TeacherBasedMetricsReportRequest,
    session: SessionDep
) -> StreamingResponse:
    """
    Generate metrics report in Excel format.
    """
    # Преобразование данных в DataFrame
    data = []
    for teacher in request.data:
        data.append({
            "Name": teacher.full_name,
            "CSAT": teacher.metrics.csat,
            "CDSAT": teacher.metrics.cdsat,
            "CSI": teacher.metrics.csi
        })
        for subject in teacher.subjects:
            data.append({
                "Name": subject.name,
                "CSAT": subject.metrics.csat,
                "CDSAT": subject.metrics.cdsat,
                "CSI": subject.metrics.csi
            })
        data.append({
            "Name": "",
            "CSAT": "",
            "CDSAT": "",
            "CSI": ""
        })
    df = pd.DataFrame(data)

    # Очистка данных
    df["CSAT"] = pd.to_numeric(df["CSAT"], errors='coerce')
    df["CDSAT"] = pd.to_numeric(df["CDSAT"], errors='coerce')
    df["CSI"] = pd.to_numeric(df["CSI"], errors='coerce')
    df = df.dropna(subset=["CSAT", "CDSAT", "CSI"])

    # Сортировка данных
    if request.sorting == "CSATвозр":
        df = df.sort_values(by="CSAT", ascending=True)
    elif request.sorting == "CSATубыв":
        df = df.sort_values(by="CSAT", ascending=False)
    elif request.sorting == "CDSATвозр":
        df = df.sort_values(by="CDSAT", ascending=True)
    elif request.sorting == "CDSATубыв":
        df = df.sort_values(by="CDSAT", ascending=False)
    elif request.sorting == "CSIвозр":
        df = df.sort_values(by="CSI", ascending=True)
    elif request.sorting == "CSIубыв":
        df = df.sort_values(by="CSI", ascending=False)

    # Генерация Excel файла
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        df.to_excel(writer, index=False, sheet_name='Metrics')
        writer._save()
    output.seek(0)

    # Формирование имени файла
    type_name = "преподаватели"
    start_date = request.period.start_date.strftime("%d.%m.%y")
    end_date = request.period.end_date.strftime("%d.%m.%y")
    filename = f"метрики_{type_name}_{start_date}-{end_date}_{request.sorting}.xlsx"
    encoded_filename = quote(filename)

    # Возврат файла в виде ответа
    return StreamingResponse(output, media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', headers={
        "Content-Disposition": f"attachment; filename*=UTF-8''{encoded_filename}"
    })


@router.post("/excel/subject_based")
async def generate_subject_based_metrics_report(
    request: SubjectBasedMetricsReportRequest,
    session: SessionDep
) -> StreamingResponse:
    """
    Generate metrics report in Excel format.
    """
    # Преобразование данных в DataFrame
    data = []
    for subject in request.data:
        data.append({
            "Name": subject.name,
            "CSAT": subject.metrics.csat,
            "CDSAT": subject.metrics.cdsat,
            "CSI": subject.metrics.csi
        })
        for teacher in subject.teachers:
            data.append({
                "Name": teacher.full_name,
                "CSAT": teacher.metrics.csat,
                "CDSAT": teacher.metrics.cdsat,
                "CSI": teacher.metrics.csi
            })
        data.append({
            "Name": "",
            "CSAT": "",
            "CDSAT": "",
            "CSI": ""
        })
    df = pd.DataFrame(data)

    # Очистка данных
    df["CSAT"] = pd.to_numeric(df["CSAT"], errors='coerce')
    df["CDSAT"] = pd.to_numeric(df["CDSAT"], errors='coerce')
    df["CSI"] = pd.to_numeric(df["CSI"], errors='coerce')
    df = df.dropna(subset=["CSAT", "CDSAT", "CSI"])

    # Сортировка данных
    if request.sorting == "CSATвозр":
        df = df.sort_values(by="CSAT", ascending=True)
    elif request.sorting == "CSATубыв":
        df = df.sort_values(by="CSAT", ascending=False)
    elif request.sorting == "CDSATвозр":
        df = df.sort_values(by="CDSAT", ascending=True)
    elif request.sorting == "CDSATубыв":
        df = df.sort_values(by="CDSAT", ascending=False)
    elif request.sorting == "CSIвозр":
        df = df.sort_values(by="CSI", ascending=True)
    elif request.sorting == "CSIубыв":
        df = df.sort_values(by="CSI", ascending=False)

    # Генерация Excel файла
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        df.to_excel(writer, index=False, sheet_name='Metrics')
        writer._save()
    output.seek(0)

    # Формирование имени файла
    type_name = "предметы"
    start_date = request.period.start_date.strftime("%d.%m.%y")
    end_date = request.period.end_date.strftime("%d.%m.%y")
    filename = f"метрики_{type_name}_{start_date}-{end_date}_{request.sorting}.xlsx"
    encoded_filename = quote(filename)

    # Возврат файла в виде ответа
    return StreamingResponse(output, media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', headers={
        "Content-Disposition": f"attachment; filename*=UTF-8''{encoded_filename}"
    })
