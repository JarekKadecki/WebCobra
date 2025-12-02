use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Participations::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Participations::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Participations::UserId).integer())
                    .col(ColumnDef::new(Participations::StudyId).integer())
                    .col(ColumnDef::new(Participations::Hash).string().unique_key())
                    .col(ColumnDef::new(Participations::Finished).boolean())
                    .col(ColumnDef::new(Participations::Answers).string())
                    .col(ColumnDef::new(Participations::Date).timestamp())
                    .col(ColumnDef::new(Participations::Stats).string())
                    .foreign_key(
                        ForeignKey::create()
                            .from(Participations::Table, Participations::StudyId)
                            .to(Studies::Table, Studies::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Participations::Table).to_owned())
            .await
    }
}

#[derive(Iden)]
enum Participations {
    Table,
    Id,
    UserId,
    StudyId,
    Hash,
    Finished,
    Answers,
    Date,
    Stats,
}

#[derive(Iden)]
enum Studies {
    Table,
    Id,
}
