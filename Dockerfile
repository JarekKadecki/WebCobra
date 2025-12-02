############################
# Stage 1: Frontend build
############################
FROM node:18 AS frontend
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build



############################
# Stage 2: Rust build
############################
FROM rustlang/rust:nightly as rust-builder

WORKDIR /app

# Copy backend & migrator sources
COPY backend/ backend/
COPY migration/ migration/

# Copy frontend build output into backend dist folder
COPY --from=frontend /app/dist backend/dist

# Build ALL binaries (backend + migrator)
WORKDIR /app/backend
RUN cargo build --release

WORKDIR /app/migration
RUN cargo build --release



############################
# Stage 3: Runtime
############################
FROM debian:bookworm-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y ca-certificates \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Backend binary
COPY --from=rust-builder /app/backend/target/release/backend /app/backend

# Migrator binary
COPY --from=rust-builder /app/migration/target/release/migrator /app/migrator

# Frontend dist
COPY --from=frontend /app/dist /app/dist

ENV RUST_LOG=rest_api=info,actix=info
ENV HOST=0.0.0.0
ENV PORT=8080
ENV FRONT_DIR=/app/dist
ENV STATIC_DIR=/app/dist/static

EXPOSE 8080

CMD ["/app/backend"]
