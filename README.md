# neural-gym
Repositorio del proyecto de ISSI
# Neural Gym 🧠🏋️

**Neural Gym** es una plataforma web interactiva para realizar pruebas cognitivas inspiradas en la neuropsicología, con el objetivo de evaluar funciones como atención, memoria y lenguaje. El sistema permite registrar usuarios, administrar sesiones de prueba, guardar resultados y visualizar estadísticas.

## 🧩 Características

- Registro e inicio de sesión de usuarios
- Pruebas cognitivas interactivas:
  - Dígitos (memoria de trabajo)
  - Letras y Números (ordenamiento secuencial)
  - Stroop Test (control inhibitorio)
- Registro de respuestas y tiempos de reacción
- Visualización de resultados por sesión
- Backend en **Django + PostgreSQL**
- Frontend en **React + TailwindCSS**
- API REST para comunicación entre frontend y backend

## 📂 Estructura del Proyecto

```
neural-gym/
├── backend/             # Proyecto Django: lógica del servidor y API
│   ├── actual_alfadin/  # Configuración principal del backend
│   ├── digitos/         # App con pruebas de dígitos y letras
│   └── memoria/         # App con pruebas de memoria y lenguaje
├── frontend/            # Aplicación React con interfaz de usuario
│   ├── public/
│   └── src/
└── README.md
```

---

## 🛠️ Requisitos

### 🔧 Backend (Django)

- Python 3.10+
- pip
- PostgreSQL
- ffmpeg (para procesar audios)
- Recomendado: entorno virtual (`venv` o `conda`)

**Instalación de dependencias:**
```bash
pip install -r requirements.txt
```

### 📦 Frontend (React)

- Node.js 18+
- npm o yarn

**Instalación de dependencias:**
```bash
cd frontend
npm install
```

---

## ⚙️ Instalación y ejecución

### 1. Clona el repositorio

```bash
git clone https://github.com/Daniel-CruzK26/neural-gym.git
cd neural-gym
```

### 2. Configura el backend

1. Crea y activa un entorno virtual:

```bash
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows
```

2. Crea el archivo `.env` y configura la base de datos PostgreSQL:

```env
SECRET_KEY=tu_clave_secreta
DEBUG=True
DB_NAME=neuralgym
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_PORT=5432
```

3. Aplica migraciones y crea el superusuario:

```bash
cd backend/neuralgym
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

4. Ejecuta el servidor:

```bash
python manage.py runserver
```

### 3. Ejecuta el frontend

```bash
cd frontend
npm start
```

---

## 📊 Pruebas Cognitivas Incluidas

| Prueba             | Función evaluada          | Descripción breve                          |
|--------------------|---------------------------|---------------------------------------------|
| Dígitos            | Memoria de trabajo        | Repetición de secuencias numéricas          |
| Letras y Números   | Atención y ordenamiento   | Ordenación alfabética y numérica combinada |
| Stroop Test        | Inhibición cognitiva      | Leer palabras ignorando el color            |

---

## 🧪 Tests

### Backend

Puedes correr los tests de Django con:

```bash
python manage.py test
```

---

## 📁 Recursos adicionales

- `/static/`: archivos generados (audios, imágenes)
- `/media/`: cargas de usuario
- `/audios/`: grabaciones de voz

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---

## 👥 Autores

- Daniel Cruz K.
- [Eduardo Cerda Zapata](https://github.com/Edu24MA)
- [Colaboradores adicionales...](https://github.com/Daniel-CruzK26/neural-gym/graphs/contributors)

---

## 📬 Contacto

Para sugerencias, errores o colaboración, por favor abre un [issue](https://github.com/Daniel-CruzK26/neural-gym/issues) o contáctanos por GitHub.
