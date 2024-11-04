from fastapi import APIRouter

from app.api.routes import buildings, items, login, reviews, rooms, users, utils, roles, classes, subjects

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
api_router.include_router(items.router, prefix="/items", tags=["items"])
api_router.include_router(roles.router, prefix="/roles", tags=["roles"])
api_router.include_router(classes.router, prefix="/classes", tags=["classes"])
api_router.include_router(
    subjects.router, prefix="/subjects", tags=["subjects"])
api_router.include_router(
    reviews.router, prefix="/reviews", tags=["reviews"])
api_router.include_router(
    rooms.router, prefix="/rooms", tags=["rooms"])
api_router.include_router(
    buildings.router, prefix="/buildings", tags=["buildings"])
