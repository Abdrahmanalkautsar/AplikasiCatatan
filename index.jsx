function ActiveButton({ id, onActive }) {
  return (
    <button className="note-item__archive-button" onClick={() => onActive(id)}>Pindahkan</button>
  );
}
function ArchiveButton({ id, onArchive }) {
  return (
    <button className="note-item__archive-button" onClick={() => onArchive(id)}>Simpan</button>
  );
}
function Body({ addNote, notes, querySearch, onDelete, onArchive, onActive }) {
  const activeNotes = notes.filter((note) => note.archived === false && note.title.toLowerCase().includes(querySearch.toLowerCase().trim()));
  const archiveNotes = notes.filter((note) => note.archived === true && note.title.toLowerCase().includes(querySearch.toLowerCase().trim()));

  return (
    <div className="note-app__body">
      <NoteInput addNote={addNote} />
      <h2>Catatan</h2>
      <NotesList notes={activeNotes} onDelete={onDelete} onArchive={onArchive} />
      <h2>Catatan Tersimpan</h2>
      <NotesList notes={archiveNotes} onDelete={onDelete} onActive={onActive} />
    </div>
  );
}
function DeleteButton({ id, onDelete }) {
  return (
    <button className="note-item__delete-button" onClick={() => onDelete(id)}>Hapus</button>
  );
}
function Header({ searchNote }) {
  return (
    <div className="note-app__header">
      <h1>MyNotes</h1>
      <NoteSearch searchNote={searchNote} />
    </div>
  );
}
class NoteInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      body: '',
      maxChar: 50,
    }

    this.onTitleChangeEventHandler = this.onTitleChangeEventHandler.bind(this);
    this.onBodyChangeEventHandler = this.onBodyChangeEventHandler.bind(this);

    this.onSubmitEventHandler = this.onSubmitEventHandler.bind(this);
  }

  onTitleChangeEventHandler(event) {
    this.setState(() => {
      return {
        title: event.target.value.slice(0, this.state.maxChar),
      }
    });
  }

  onBodyChangeEventHandler(event) {
    this.setState(() => {
      return {
        body: event.target.value,
      }
    });
  }

  onSubmitEventHandler(event) {
    event.preventDefault();
    this.props.addNote(this.state);

    this.setState(() => {
      return {
        title: '',
        body: '',
      }
    });
  }

  render() {
    return (
      <div className="note-input">
        <h2>Buat catatan baru</h2>
        <form onSubmit={this.onSubmitEventHandler}>
          <p className="note-input__title__char-limit">Sisa karakter: {this.state.maxChar - this.state.title.length}</p>
          <input className="note-input__title" type="text" placeholder="Tulis judul kamu" value={this.state.title} onChange={this.onTitleChangeEventHandler} required />
          <textarea className="note-input__body" type="text" placeholder="Deskripsi catatan ..." value={this.state.body} onChange={this.onBodyChangeEventHandler} required></textarea>
          <button type="submit">Buat</button>
        </form>
      </div>
    );
  }
}
function NoteItem({ id, title, createdAt, body, archived, onDelete, onArchive, onActive }) {
  return (
    <div className="note-item">

      <NoteItemContent title={title} date={showFormattedDate(createdAt)} body={body} />

      <div className="note-item__action">
        <DeleteButton id={id} onDelete={onDelete} />
        {
          archived ?
            <ActiveButton id={id} onActive={onActive} />
            :
            <ArchiveButton id={id} onArchive={onArchive} />
        }
      </div>
    </div>
  );
}
function NoteItemContent({ title, date, body }) {
  return (
    <div className="note-item__content">
      <h3 className="note-item__title">{title}</h3>
      <p className="note-item__date">{date}</p>
      <p className="note-item__body">{body}</p>
    </div>
  );
}
class NotesApp extends React.Component {
  constructor(props) {
    super(props);

    const notes = getInitialData();

    this.state = {
      notes: notes,
      querySearch: '',
    }

    this.onAddNoteEventHandler = this.onAddNoteEventHandler.bind(this);

    this.onDeleteHandler = this.onDeleteHandler.bind(this);
    this.onArchiveHandler = this.onArchiveHandler.bind(this);
    this.onActiveHandler = this.onActiveHandler.bind(this);

    this.onSearchEventHandler = this.onSearchEventHandler.bind(this);
  }

  onAddNoteEventHandler({ title, body }) {
    this.setState((prevState) => {
      return {
        notes: [
          ...prevState.notes,
          {
            id: +new Date(),
            title,
            body,
            createdAt: new Date().toISOString(),
            archived: false,
          }
        ]
      }
    });
   const message = 'catatan berhasil dibuat';
   alert(message);
  }

  onDeleteHandler(id) {
    this.setState({ notes: this.state.notes.filter((note) => note.id !== id) });
    const message = 'catatan berhasil dihapus';
    alert(message);
  }

  onArchiveHandler(id) {
    this.setState({ notes: this.state.notes.map((note) => note.id === id ? { ...note, archived: true } : note) });
    const message = 'catatan berhasil disimpan';
    alert(message);
  }

  onActiveHandler(id) {
    this.setState({ notes: this.state.notes.map((note) => note.id === id ? { ...note, archived: false } : note) });
  }

  onSearchEventHandler({ query }) {
    this.setState(() => {
      return { querySearch: query }
    });
  }

  render() {
    return (
      <>
        <Header searchNote={this.onSearchEventHandler} />
        <Body addNote={this.onAddNoteEventHandler} notes={this.state.notes} querySearch={this.state.querySearch} onDelete={this.onDeleteHandler} onArchive={this.onArchiveHandler} onActive={this.onActiveHandler} />
      </>
    );
  }
}
class NoteSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = { query: '' };

    this.onQueryChangeEventHandler = this.onQueryChangeEventHandler.bind(this);
  }

  onQueryChangeEventHandler(event) {
    this.setState({ query: event.target.value }, () => {
      return this.props.searchNote(this.state);
    });
  }

  render() {
    return (
      <div className="note-search">
        <input type="text" placeholder="Cari catatan ..." value={this.state.query} onChange={this.onQueryChangeEventHandler} />
      </div>
    );
  }
}
function NotesList({ notes, onDelete, onArchive, onActive }) {
  if (notes.length === 0) {
    return (
      <p className="notes-list__empty-message">Tidak ada catatan yang tersimpan</p>
    );
  }

  return (
    <div className="notes-list">
      {
        notes.map((note) => (
          <NoteItem key={note.id} {...note} onDelete={onDelete} onArchive={onArchive} onActive={onActive} />
        ))
      }
    </div>
  );
}

const getInitialData = () => ([
  {
    id: 1,
    title: "Nakajima Ki-43",
    body: "Nakajima Ki-43 atau biasa disebut Hayabusa merupakan pesawat tempur berbasis darat yang digunakan oleh Pasukan Udara Angkatan Darat Kekaisaran Jepang selama Perang Dunia II. Hayabusa juga dipakai oleh Manchukuo serta Thailand saat itu.",
    createdAt: '2025-01-12T22:07:34.572Z',
    archived: false,
  },
  {
    id: 2,
    title: "Kawasaki Ki-100",
    body: "Kawasaki Ki-100 adalah pesawat tempur yang digunakan oleh Tentara Kekaisaran Jepang dalam Perang Dunia II. Penunjukan Tentara Jepang adalah Tipe  Fighter. Tidak ada kode nama Sekutu ditugaskan untuk jenis ini, meskipun mungkin telah salah diidentifikasi sebagai Tony karena profil yang sama dan penampilan.",
    createdAt: '2025-01-12T22:09:34.572Z',
    archived: false,
  },
  {
    id: 3,
    title: "Mitshubishi G4M",
    body: "Pesawat serang berbasis darat tipe 1 adalah pesawat bomber darat utama bermesin ganda, yang digunakan oleh Dinas Udara Angkatan Laut Kekaisaran Jepang pada Perang Dunia II. Pihak Sekutu memberi G4M nama pelaporan Betty.",
    createdAt: '2025-01-12T22:10:34.572Z',
    archived: false,
  },
  {
    id: 4,
    title: "Tachikawa Ki-74",
    body: "Tachikawa Ki-74 adalah pesawat pengebom pengintai jarak jauh eksperimental Jepang pada Perang Dunia II . Pesawat monoplane bermesin ganda dan bersayap tengah ini dikembangkan untuk Angkatan Udara Kekaisaran Jepang tetapi tidak pernah dikerahkan dalam pertempuran. ",
    createdAt: '2025-01-12T22:11:34.572Z',
    archived: false,
  },
  {
    id: 5,
    title: "Mitshubishi KI-51",
    body: "Mitshubishi Ki-51 adalah sebuah bomber / dive bomber ringan yang melayani Tentara Kekaisaran Jepang selama Perang Dunia II.Pesawat Ini pertama kali terbang pada pertengahan 1939. Awalnya digunakan melawan pasukan Cina, itu terbukti menjadi terlalu lambat untuk menahan melawan pesawat tempur dari kekuatan Sekutu lainnya.",
    createdAt: '2025-01-12T22:12:34.572Z',
    archived: false,
  },
  {
    id: 6,
    title: "Kawasaki Ki-102",
    body: "Kawasaki Ki-102 adalah pesawat tempur Jepang Perang Dunia II yang bermesin ganda, dua kursi, tempur berat jangka panjang dikembangkan untuk menggantikan Ki-45 Toryu.",
    createdAt: '2025-01-12T22:14:34.572Z',
    archived: false,
  },
]);

const showFormattedDate = (date) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }
  return new Date(date).toLocaleDateString("id-ID", options)
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<NotesApp />);
