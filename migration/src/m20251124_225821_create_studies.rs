use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Studies::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Studies::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Studies::Name).string())
                    .col(ColumnDef::new(Studies::CreatedAt).timestamp())
                    .col(ColumnDef::new(Studies::Configuration).string())
                    .col(ColumnDef::new(Studies::Questions).string())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Studies::Table).to_owned())
            .await
    }
}

#[derive(Iden)]
enum Studies {
    Table,
    Id,
    Name,
    CreatedAt,
    Configuration,
    Questions,
}
