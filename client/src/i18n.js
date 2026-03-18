import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const STORAGE_KEY = 'discursantes_language';
const SUPPORTED_LANGUAGES = ['es', 'en'];

const getInitialLanguage = () => {
  const storedLanguage = window.localStorage.getItem(STORAGE_KEY);
  if (storedLanguage && SUPPORTED_LANGUAGES.includes(storedLanguage)) {
    return storedLanguage;
  }

  if (navigator.language && navigator.language.toLowerCase().startsWith('en')) {
    return 'en';
  }

  return 'es';
};

const resources = {
  es: {
    translation: {
      appName: 'Discursantes',
      nav: {
        home: 'Inicio',
        newSunday: 'Nuevo Domingo',
        speakers: 'Discursantes',
        topics: 'Temas',
        history: 'Historial',
        language: 'Idioma',
      },
      common: {
        loading: 'Cargando...',
        close: 'Cerrar',
        save: 'Guardar',
        cancel: 'Cancelar',
        edit: 'Editar',
        delete: 'Eliminar',
        create: 'Crear',
        actions: 'Acciones',
        unknown: 'Desconocido',
        never: 'Nunca',
        noData: '—',
      },
      dashboard: {
        title: 'Panel Principal',
        subtitle: 'Gestion de discursantes y discursos dominicales',
        sundaySelectionTitle: 'Seleccionar Discursantes para el Domingo',
        sundaySelectionDesc: 'Asignar discursantes y temas para el proximo domingo',
        speakersTitle: 'Ver Discursantes',
        speakersDesc: 'Administrar el listado de discursantes del barrio',
        topicsTitle: 'Ver Temas',
        topicsDesc: 'Consultar los temas que se han tratado en los discursos',
        historyTitle: 'Historial de Domingos',
        historyDesc: 'Ver el registro completo de discursos por fecha',
      },
      speakersPage: {
        title: 'Discursantes',
        subtitle: 'Administra el listado de discursantes del barrio',
        listTitle: 'Listado',
        newSpeaker: 'Nuevo Discursante',
        noSpeakers: 'No hay discursantes registrados',
        addFirst: 'Agregar el primero',
        name: 'Nombre',
        calling: 'Llamamiento',
        lastSpeech: 'Ultimo Discurso',
        total: 'Total',
        newSpeakerTitle: 'Nuevo Discursante',
        editSpeakerTitle: 'Editar Discursante',
        firstNames: 'Nombres',
        lastNames: 'Apellidos',
        saveChanges: 'Guardar Cambios',
        callingPlaceholder: 'Ej: Lider misional, Presidente de EQ...',
        deleteConfirm: 'Eliminar a {{name}}?',
        saveError: 'Error al guardar: {{error}}',
        deleteError: 'Error al eliminar',
      },
      historyPage: {
        title: 'Historial de Domingos',
        subtitle: 'Registro completo de discursos pasados',
        empty: 'No hay domingos registrados aun',
        deleteConfirm: 'Eliminar este discurso?',
        deleteError: 'Error al eliminar',
        speaker: 'Discursante',
        topic: 'Tema',
      },
      sundayPage: {
        title: 'Seleccionar Discursantes para el Domingo',
        subtitle: 'Asigna quienes van a hablar y sobre que tema',
        sundayDate: 'Fecha del Domingo',
        loadingDate: 'Cargando...',
        editingExistingSunday: 'Editando domingo existente',
        newSunday: 'Nuevo domingo',
        suggestionsTitle: 'Sugerencias (hace mas tiempo sin hablar)',
        noRegisteredSpeakers: 'No hay discursantes registrados',
        last: 'Ultimo: {{date}}',
        neverSpoken: 'Nunca ha hablado',
        neverTag: '(nunca)',
        sundaySpeakers: 'Discursantes del Domingo',
        addSpeaker: 'Agregar Discursante',
        startHint: 'Haz clic en una sugerencia o en "+ Agregar Discursante" para comenzar',
        selectSpeaker: 'Discursante',
        selectOption: 'Seleccionar...',
        topic: 'Tema',
        topicPlaceholder: 'Tema del discurso',
        dateRequired: 'Selecciona una fecha',
        atLeastOne: 'Agrega al menos un discursante con tema',
        saveSuccess: 'Discursos guardados correctamente!',
        updateSuccess: 'Discursos actualizados correctamente!',
        saveError: 'Error al guardar: {{error}}',
        saving: 'Guardando...',
        saveSundaySpeeches: 'Guardar Discursos del Domingo',
        updateSundaySpeeches: 'Actualizar Discursos del Domingo',
      },
      topicsPage: {
        title: 'Temas',
        subtitle: 'Temas tratados en los discursos dominicales',
        empty: 'No hay temas registrados aun',
        topic: 'Tema',
        speaker: 'Discursante',
        date: 'Fecha',
      },
    },
  },
  en: {
    translation: {
      appName: 'Speakers',
      nav: {
        home: 'Home',
        newSunday: 'New Sunday',
        speakers: 'Speakers',
        topics: 'Topics',
        history: 'History',
        language: 'Language',
      },
      common: {
        loading: 'Loading...',
        close: 'Close',
        save: 'Save',
        cancel: 'Cancel',
        edit: 'Edit',
        delete: 'Delete',
        create: 'Create',
        actions: 'Actions',
        unknown: 'Unknown',
        never: 'Never',
        noData: '—',
      },
      dashboard: {
        title: 'Main Dashboard',
        subtitle: 'Sunday speakers and talks management',
        sundaySelectionTitle: 'Select Sunday Speakers',
        sundaySelectionDesc: 'Assign speakers and topics for next Sunday',
        speakersTitle: 'View Speakers',
        speakersDesc: 'Manage the ward speaker list',
        topicsTitle: 'View Topics',
        topicsDesc: 'Check topics that were covered in talks',
        historyTitle: 'Sunday History',
        historyDesc: 'View full record of talks by date',
      },
      speakersPage: {
        title: 'Speakers',
        subtitle: 'Manage the ward speaker list',
        listTitle: 'List',
        newSpeaker: 'New Speaker',
        noSpeakers: 'No speakers registered',
        addFirst: 'Add the first one',
        name: 'Name',
        calling: 'Calling',
        lastSpeech: 'Last Talk',
        total: 'Total',
        newSpeakerTitle: 'New Speaker',
        editSpeakerTitle: 'Edit Speaker',
        firstNames: 'First names',
        lastNames: 'Last names',
        saveChanges: 'Save Changes',
        callingPlaceholder: 'Ex: Mission Leader, EQ President...',
        deleteConfirm: 'Delete {{name}}?',
        saveError: 'Error saving: {{error}}',
        deleteError: 'Error deleting',
      },
      historyPage: {
        title: 'Sunday History',
        subtitle: 'Complete record of past talks',
        empty: 'No Sundays registered yet',
        deleteConfirm: 'Delete this talk?',
        deleteError: 'Error deleting',
        speaker: 'Speaker',
        topic: 'Topic',
      },
      sundayPage: {
        title: 'Select Sunday Speakers',
        subtitle: 'Assign who will speak and on which topic',
        sundayDate: 'Sunday Date',
        loadingDate: 'Loading...',
        editingExistingSunday: 'Editing existing Sunday',
        newSunday: 'New Sunday',
        suggestionsTitle: 'Suggestions (longest without speaking)',
        noRegisteredSpeakers: 'No speakers registered',
        last: 'Last: {{date}}',
        neverSpoken: 'Never spoken',
        neverTag: '(never)',
        sundaySpeakers: 'Sunday Speakers',
        addSpeaker: 'Add Speaker',
        startHint: 'Click a suggestion or "+ Add Speaker" to start',
        selectSpeaker: 'Speaker',
        selectOption: 'Select...',
        topic: 'Topic',
        topicPlaceholder: 'Talk topic',
        dateRequired: 'Select a date',
        atLeastOne: 'Add at least one speaker with a topic',
        saveSuccess: 'Talks saved successfully!',
        updateSuccess: 'Talks updated successfully!',
        saveError: 'Error saving: {{error}}',
        saving: 'Saving...',
        saveSundaySpeeches: 'Save Sunday Talks',
        updateSundaySpeeches: 'Update Sunday Talks',
      },
      topicsPage: {
        title: 'Topics',
        subtitle: 'Topics covered in Sunday talks',
        empty: 'No topics registered yet',
        topic: 'Topic',
        speaker: 'Speaker',
        date: 'Date',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  window.localStorage.setItem(STORAGE_KEY, lng);
});

export { STORAGE_KEY, SUPPORTED_LANGUAGES };
export default i18n;
