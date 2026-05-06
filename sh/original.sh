#!/bin/bash
# =====================================================
# Script de respaldo automático del proyecto SICAT
# Ubicación: ~/Documents/respaldoSICAT/
# Incluye: pipes, redirecciones, procesos y
# está preparado para automatizarse con cron.
# =====================================================

# Carpeta a respaldar (proyecto SICAT)
SOURCE_DIR="$HOME/Documents/8vosemestre/fede/SICAT"

# Carpeta donde se guardan los backups (dentro de respaldoSICAT)
BACKUP_DIR="$HOME/Documents/respaldoSICAT/backups"

# Archivo de logs
LOG_FILE="$HOME/Documents/respaldoSICAT/respaldo_sicat.log"

# Fecha para el nombre del archivo
DATE=$(date +"%Y-%m-%d_%H-%M-%S")

# Nombre del backup
BACKUP_FILE="backup_SICAT_$DATE.tar.gz"

# Crear carpeta de backups si no existe
mkdir -p "$BACKUP_DIR"

echo "---------------------------------" >> "$LOG_FILE"
echo "Iniciando backup del proyecto SICAT: $(date)" >> "$LOG_FILE"

# Verificar si existe la carpeta origen
if [ ! -d "$SOURCE_DIR" ]; then
    echo "ERROR: La carpeta origen no existe: $SOURCE_DIR" >> "$LOG_FILE"
    exit 1
fi

# ---------- PIPES: información previa del proyecto ----------
# Contar cuántos archivos tiene el proyecto (find | wc -l)
TOTAL_ARCHIVOS=$(find "$SOURCE_DIR" -type f | wc -l | tr -d ' ')
echo "Archivos en el proyecto: $TOTAL_ARCHIVOS" >> "$LOG_FILE"

# Tamaño total de la carpeta origen (du | awk)
TAMANO_ORIGEN=$(du -sh "$SOURCE_DIR" | awk '{print $1}')
echo "Tamaño de la carpeta origen: $TAMANO_ORIGEN" >> "$LOG_FILE"

# Crear backup del proyecto SICAT (redirección de errores 2>>)
tar -czf "$BACKUP_DIR/$BACKUP_FILE" -C "$HOME/Documents/8vosemestre/fede" "SICAT" 2>> "$LOG_FILE"

# Verificar si funcionó
if [ $? -eq 0 ]; then
    # Tamaño del archivo de backup generado (du | cut)
    TAMANO_BACKUP=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)
    echo "Backup creado correctamente: $BACKUP_FILE ($TAMANO_BACKUP)" >> "$LOG_FILE"
else
    echo "ERROR: Falló la creación del backup" >> "$LOG_FILE"
    exit 1
fi

# Eliminar backups de más de 7 días
find "$BACKUP_DIR" -name "backup_SICAT_*.tar.gz" -type f -mtime +7 -delete
echo "Backups antiguos (más de 7 días) eliminados" >> "$LOG_FILE"

# ---------- PIPES: resumen de backups existentes ----------
# Contar cuántos backups hay guardados (ls | wc -l)
TOTAL_BACKUPS=$(ls -1 "$BACKUP_DIR"/backup_SICAT_*.tar.gz 2>/dev/null | wc -l | tr -d ' ')
echo "Backups disponibles actualmente: $TOTAL_BACKUPS" >> "$LOG_FILE"

# Mostrar los 5 backups más recientes (ls -lt | head)
echo "Últimos 5 backups:" >> "$LOG_FILE"
ls -lt "$BACKUP_DIR"/backup_SICAT_*.tar.gz 2>/dev/null | head -n 5 | awk '{print $9, $5"B"}' >> "$LOG_FILE"

echo "Backup de SICAT finalizado: $(date)" >> "$LOG_FILE"
