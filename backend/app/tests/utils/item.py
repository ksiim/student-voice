from sqlmodel import Session

from app import crud
from app.models import Item, ItemCreate
from app.tests.utils.user import create_random_user
from app.tests.utils.utils import random_lower_string


async def create_random_item(db: Session) -> Item:
    user = await create_random_user(db)
    owner_id = user.id
    assert owner_id is not None
    title = await random_lower_string()
    description = await random_lower_string()
    item_in = ItemCreate(title=title, description=description)
    return await crud.create_item(session=db, item_in=item_in, owner_id=owner_id)
