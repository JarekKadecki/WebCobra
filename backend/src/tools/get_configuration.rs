use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, QuerySelect, RelationTrait};

use crate::models::{participations, studies};

use serde_json::Value;

pub async fn get_configuration_by_hash(
    db: &DatabaseConnection,
    hash: &str,
) -> Result<Option<Value>, sea_orm::DbErr> {
    studies::Entity::find()
        .join(
            sea_orm::JoinType::InnerJoin,
            studies::Relation::Participations.def(),
        )
        .filter(participations::Column::Hash.eq(hash))
        .select_only()
        .column(studies::Column::Configuration)
        .into_tuple::<Value>() // <-- Here!
        .one(db)
        .await
}
