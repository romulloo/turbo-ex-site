from sqlalchemy.orm import Session
from models import Service, Seller


def seed_services(db: Session):
    if db.query(Service).count() > 0:
        return
    services = [
        Service(title="Venda de Turbinas Novas", description="Turbinas originais e de alta performance para todos os tipos de veiculos.", icon="package"),
        Service(title="Turbinas Recondicionadas", description="Turbinas recondicionadas com garantia e qualidade assegurada.", icon="refresh-cw"),
        Service(title="Manutencao", description="Manutencao preventiva e corretiva para prolongar a vida util da sua turbina.", icon="wrench"),
        Service(title="Balanceamento", description="Balanceamento de precisao para maximo desempenho e durabilidade.", icon="gauge"),
        Service(title="Reparo", description="Reparo completo com pecas originais e mao de obra especializada.", icon="settings"),
    ]
    db.add_all(services)
    db.commit()


def seed_sellers(db: Session):
    if db.query(Seller).count() > 0:
        return
    sellers = [
        Seller(
            name="Vendedor Curitiba",
            description="Atendimento especializado para a regiao de Curitiba e regiao metropolitana.",
            photo_url=None,
            whatsapp="5541999999999",
            coverage="curitiba",
        ),
        Seller(
            name="Vendedor Brasil",
            description="Atendimento para todo o territorio nacional com envio para todo o Brasil.",
            photo_url=None,
            whatsapp="5541888888888",
            coverage="brasil",
        ),
    ]
    db.add_all(sellers)
    db.commit()


def run_seed(db: Session):
    seed_services(db)
    seed_sellers(db)
