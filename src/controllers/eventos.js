import { conn } from "../config/db.js"

export const createEvento = (req, res) => {

    const {nome, data, horario, sala, status} = req.body
    let query = 'INSERT INTO eventos (evento_nome, data, horario, sala, status) VALUES ($1, $2, $3, $4, $5)'

    try{

        conn.query(query, [nome, data, horario, sala, status], (error, results) => {

            if(error) {
                throw error
            }

            res.status(201).send(`Evento added with ID: ${results.evento_nome}`);

        })

    } catch(err) {

        return res.status(500).send(err)

    }

}

export const getEventos = (req, res) => {

    let query = `SELECT * FROM eventos`

    try{

        conn.query(query, (error, results) => {
            if(error) {
                throw error
            }
            return res.status(200).json(results.rows)
        })

    }catch(err) {

        return response(500).send(err)

    }

}

export const getEventoById = (request, response) => {

    const id = parseInt(request.params.id)
    let query = 'SELECT * FROM eventos WHERE evento_nome = $1';

    try{

        conn.query(query, [id], (error,results) => {
            if(error) {
                throw error
            }
            return response.status(200).json(results.rows)    
        })

    } catch(err) {

        return response.status(500).send(err)

    }
    

}

export const updateEvento = (request, response) => {

    const id = parseInt(request.params.id)
    const {data, horario, sala, status} = request.body

    let query = 'UPDATE eventos SET evento_nome = $1, data = $2, horario = $3, sala = $4, status = $4 WHERE evento_nome = $1'

    try {

        conn.query(query, [id, data, horario, sala, status], (error, results) => {

            if(error){
                throw error
            }

            return response.status(200).send(`Evento modified with ID: ${id}`)

        })

    } catch(err) {

        return response.status(500).send(err)

    }

}

export const deleteEvento = (request, response) => {

    const id = parseInt(request.params.id)

    let query = 'DELETE FROM eventos WHERE evento_nome = $1'

    try {

        conn.query(query, [id], (error, results) => {

            if(error){
                throw error
            }

            return response.status(200).send(`Evento deleted with ID: ${id}`)

        })

    } catch(err) {

        return response.status(500).send(err)

    }

}
