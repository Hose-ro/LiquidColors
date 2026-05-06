#Carpeta a respaldar 
SOURCE_DIR="$HOME/Documents/8vosemestre/fede/SICAT"

#Carpeta donde se guardan los backups (dentro de la carpeta respaldoSICAT)
BACKUP_DIR="$HOME/Documents/respaldoSICAT/backups"

#Archivo de logs donde se registran los cambios o respaldos hechos
LOG_FILE="$HOME/Documents/respaldoSICAT/respaldo_sicat.log"

#fecha para el nombre del archivo, para que sean siempre diferentes 
DATE=$(date +"%Y-%m-%d_%H-%M-%S")

#nombre del backup
BACKUP_FILE="backup_SICAT_$DATE.tar.gz"

#Crear carpeta de backup si no existe
mkdir -p "$BACKUP_DIR"


echo "---------------------------------" >> "$LOG_FILE"
echo "Iniciando backup del proyecto SICAT: $(date)" >> "$LOG_FILE"


#verificamos con un if si existe la carpeta de origen a la que le haremos la copia de seguridad
if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: la carpeta origen no existe: $SOURCE_DIR" >> "$LOG_FILE"
    exit 1
fi

# ---------- PIPES: información previa del proyecto ----------
# Contar cuántos archivos tiene el proyecto (find | wc -l)
#esto se refleja en los logs
TOTAL_ARCHIVOS=$(find "$SOURCE_DIR" | awk '{print $1}')
