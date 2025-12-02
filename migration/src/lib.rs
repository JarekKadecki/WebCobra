use sea_orm_migration::prelude::*;

mod m20251124_225821_create_studies;
mod m20251124_225829_create_participations;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20251124_225821_create_studies::Migration),
            Box::new(m20251124_225829_create_participations::Migration),
        ]
    }
}
