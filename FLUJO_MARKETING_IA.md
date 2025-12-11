# Máquina de Generación de Leads con IA (Agencia In-House)

Este documento detalla la arquitectura funcional de un sistema integral de marketing y ventas automatizado. El objetivo es consolidar múltiples canales de adquisición en un solo flujo inteligente que entrega **Leads Calientes** listos para cerrar.

## Concepto Central

Una "Mini Agencia" autónoma dentro del dashboard que gestiona todo el ciclo de vida del lead: desde la atracción (contenido/ads) hasta la cualificación (IA/Chatbots), centralizando la data y automatizando el trabajo manual.

---

## Módulos del Sistema (Pestañas del Dashboard)

### 1. 📊 Dashboard Principal (Vista Aérea)

Resumen ejecutivo en tiempo real.

- **KPIs**: Total Leads capturados, Tasa de Conversión, Costo por Lead (CPL).
- **Embudo Visual**: Visitantes -> Leads -> Conversaciones -> Leads Calientes -> Ventas.
- **Alertas**: Notificaciones de "Leads Calientes" que requieren atención humana inmediata.

### 2. 📥 Centro de Captura (Omnicanal)

Punto de entrada unificado. Todos los canales vierten sus datos aquí.

- **Integraciones Activas**:
  - **Meta (Instagram/Facebook)**: Comentarios, DMs y Lead Ads.
  - **Google Ads**: Formularios de clientes potenciales.
  - **Sitio Web**: Formularios de contacto y pop-ups.
  - **Correo Electrónico**: Respuestas a campañas (Cold Email / Newsletter).
  - **WhatsApp API**: Mensajes entrantes al número de empresa.

### 3. 📅 Motor de Contenidos (Content Factory)

Donde se genera el tráfico orgánico y la presencia de marca.

- **Calendario Editorial**: Vista mensual de posts y correos.
- **Generador IA**:
  - Crea copys y sugiere visuales para redes.
  - Redacta secuencias de email marketing.
- **Flujo de Aprobación**:
  - _Borrador IA_ -> _Revisión Humana (Editar/Aprobar)_ -> _Programación Automática_.

### 4. 🤖 Automatización y Nutrición (The Brain)

El motor que trabaja los leads automáticamente 24/7.

- **WhatsApp Bot (IA)**: Responde dudas frecuentes, califica interés y agenda reuniones.
- **Email Sequences**: Flujos de nutrición (Drip campaigns) basados en el comportamiento del usuario.
- **Lead Scoring**: La IA asigna puntos (0-100) según interacciones (abrió correo, respondió whatsapp, visitó web).

### 5. 👥 CRM Inteligente (Gestión de Leads)

Lista viva de prospectos. No es una tabla estática, es un flujo de trabajo.

- **Vista Pipeline (Kanban)**:
  - _Nuevo_: Recién entrado.
  - _En Nutrición_: La IA está conversando/enviando info.
  - _Caliente_: Lead cualificado (Score alto) -> **Aquí entra el humano**.
  - _Cerrado/Perdido_.
- **Ficha del Lead 360**: Historial de chat (WhatsApp/Email unificados), origen, puntaje y notas de la IA.

### 6. ⚙️ Configuración de la Agencia

- **Identidad de Marca**: Definición del tono de voz, pilares de contenido y buyer personas.
- **Reglas de Negocio**: Criterios para considerar un lead "Caliente" (ej. pide precio, agenda cita).

---

## Flujo de Trabajo Automatizado (Ejemplo)

1.  **Entrada**: Un usuario ve un anuncio en **Instagram** y envía un DM preguntando precio, O llena un formulario en la **Web**.
2.  **Captura**: El sistema crea el perfil en el **CRM** inmediatamente.
3.  **Respuesta Inmediata**:
    - Si es DM/WhatsApp: La **IA (WhatsApp API)** responde al instante con info y hace una pregunta de cualificación.
    - Si es Formulario: Se envía un **Email** de bienvenida y se activa una secuencia de seguimiento.
4.  **Nutrición y Estudio**:
    - El sistema rastrea si abre los correos o sigue conversando en el chat.
    - La IA analiza el sentimiento de las respuestas (¿Curiosidad? ¿Urgencia? ¿Queja?).
5.  **Conversión (El "Lead Caliente")**:
    - El usuario dice "Quiero agendar una demo" o su Lead Score supera los 80 puntos.
    - **Acción**: El sistema mueve el lead a la columna "Caliente" y envía una notificación push al equipo de ventas.
6.  **Cierre**: El agente humano toma el control del chat/teléfono para cerrar la venta.

---

## 7. Gestión de Datos del Lead (Perfil y Calidad)

### El "Super Perfil" del Lead

Para evitar fichas dispersas, cada lead tiene un perfil maestro que se va completando con el tiempo (Progressive Profiling).

- **Datos Clave (Identificadores Únicos)**:
  - _Email_: La llave maestra para unir identidades.
  - _Teléfono (WhatsApp)_: Identificador secundario crítico.
  - _Social Handles_: @usuario en IG/Twitter.
- **Datos Enriquecidos (Contexto)**:
  - Origen (¿Vino por Ads, Orgánico, Referido?).
  - Intereses (Etiquetas basadas en qué posts comentó o qué páginas visitó).
  - Score (Puntaje de temperatura).

### Estrategia Anti-Redundancia (Deduplicación Inteligente)

El sistema ejecuta una comprobación cada vez que entra un dato nuevo:

1.  **Búsqueda de Coincidencias**: ¿Ya existe este email? ¿Ya existe este teléfono?
2.  **Fusión Automática (Merge)**:
    - _Escenario_: Juan escribe por Instagram (Lead A) y mañana llena un formulario web con su email (Lead B).
    - _Acción_: Si el sistema logra conectar el dato (ej. el bot de IG le pidió el email), **fusiona** A y B en una sola ficha. Se conserva el historial de ambas interacciones.
3.  **Prioridad de Fuente**: Si hay conflicto de datos (ej. dos nombres distintos), se prioriza la información explícita dada en formularios sobre la inferida por redes sociales.

### Manejo de Leads de "Baja Información" (El click en "Me Interesa")

Cuando un usuario solo da un click (ej. botón de WhatsApp o Lead Ad rápido) y no deja datos:

1.  **Activación Conversacional Inmediata (Bot)**:
    - El sistema detecta la intención pero la falta de datos.
    - **Acción**: El Bot de WhatsApp/DM se activa al instante: _"¡Hola! Vi que te interesó nuestra solución X. Para ver si aplica para tu caso, ¿tienes web actualmente?"_.
    - _Objetivo_: Sacar la información faltante conversando, no con formularios aburridos.
2.  **Enriquecimiento Pasivo**:
    - Si viene de redes sociales, el sistema intenta capturar datos públicos (Nombre de perfil, Bio, Foto) para pre-llenar la ficha.
3.  **Retargeting**:
    - Si no responde, se le etiqueta como "Visitante Anónimo" y se le impacta con anuncios de retargeting para intentar capturarlo de nuevo más adelante.
