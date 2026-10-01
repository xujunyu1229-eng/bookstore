import { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  IconButton,
  Stack,
  Box
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

const DATABASE_URL =
  'https://bookstore-5cbfb-default-rtdb.firebaseio.com/books'

function App() {
  const [books, setBooks] = useState([])
  const [book, setBook] = useState({
    title: '',
    author: '',
    year: '',
    isbn: '',
    price: ''
  })

  const fetchBooks = () => {
    fetch(`${DATABASE_URL}.json`)
      .then(response => response.json())
      .then(data => {
        if (data) {
          const rows = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }))
          setBooks(rows)
        } else {
          setBooks([])
        }
      })
      .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const inputChanged = event => {
    setBook({
      ...book,
      [event.target.name]: event.target.value
    })
  }

  const addBook = () => {
    fetch(`${DATABASE_URL}.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(book)
    })
      .then(() => {
        setBook({
          title: '',
          author: '',
          year: '',
          isbn: '',
          price: ''
        })
        fetchBooks()
      })
      .catch(err => console.error(err))
  }

  const deleteBook = id => {
    fetch(`${DATABASE_URL}/${id}.json`, {
      method: 'DELETE'
    })
      .then(() => fetchBooks())
      .catch(err => console.error(err))
  }

  const columns = [
    { field: 'title', headerName: 'Title', width: 180 },
    { field: 'author', headerName: 'Author', width: 180 },
    { field: 'year', headerName: 'Year', width: 100 },
    { field: 'isbn', headerName: 'Isbn', width: 180 },
    { field: 'price', headerName: 'Price', width: 100 },
    {
      field: 'delete',
      headerName: '',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: params => (
        <IconButton
          color="error"
          onClick={() => deleteBook(params.row.id)}
        >
          <DeleteIcon />
        </IconButton>
      )
    }
  ]

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">Bookstore</Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <TextField
            label="Title"
            name="title"
            value={book.title}
            onChange={inputChanged}
          />
          <TextField
            label="Author"
            name="author"
            value={book.author}
            onChange={inputChanged}
          />
          <TextField
            label="Year"
            name="year"
            value={book.year}
            onChange={inputChanged}
          />
          <TextField
            label="Isbn"
            name="isbn"
            value={book.isbn}
            onChange={inputChanged}
          />
          <TextField
            label="Price"
            name="price"
            value={book.price}
            onChange={inputChanged}
          />
          <Button variant="outlined" onClick={addBook}>
            ADD BOOK
          </Button>
        </Stack>

        <div style={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={books}
            columns={columns}
            showToolbar
          />
        </div>
      </Box>
    </>
  )
}

export default App
