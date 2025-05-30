const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// EJS + middlewares
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // para base64 grande

// Rotas
app.get('/', (req, res) => res.render('home'));

app.get('/formulario', (req, res) => res.render('formulario'));

app.post('/formulario', async (req, res) => {
  const { nome, email, empresa, motivo, foto_base64 } = req.body;

  const { data, error } = await supabase
    .from('visitas')
    .insert([{
      nome,
      email,
      empresa,
      motivo,
      foto_base64,
      data_registro: new Date().toISOString(),
    }]);

  if (error) {
    console.error('Erro ao inserir no Supabase:', error.message);
    return res.status(500).send('Erro ao registrar visita');
  }

  res.render('crachadigital', { nome, empresa, motivo });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
