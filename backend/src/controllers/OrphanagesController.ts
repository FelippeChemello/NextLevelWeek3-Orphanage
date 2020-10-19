import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import * as Yup from 'yup'

import Orphanage from '../models/Orphanage'
import orphanagesView from '../views/orphangesView'

export default {
    async index(request: Request, response: Response) {
        const orphanagesRepository = getRepository(Orphanage)

        const orphanages = await orphanagesRepository.find({
            relations: ['images'],
        })

        return response.status(200).json(orphanagesView.renderMany(orphanages))
    },

    async show(request: Request, response: Response) {
        const { id } = request.params

        const orphanagesRepository = getRepository(Orphanage)

        const orphanage = await orphanagesRepository.findOneOrFail(id, {
            relations: ['images'],
        })

        return response.status(200).json(orphanagesView.render(orphanage))
    },

    async create(request: Request, response: Response) {
        const { name, latitude, longitude, about, instructions, openingHours, openOnWeekends } = request.body

        const orphanagesRepository = getRepository(Orphanage)

        const requestImages = request.files as Express.Multer.File[]
        const images = requestImages.map(image => {
            return { path: image.filename }
        })

        const orphanageData = {
            name,
            latitude,
            longitude,
            about,
            instructions,
            openingHours,
            openOnWeekends: openOnWeekends === 'true',
            images,
        }

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            latitude: Yup.number().required(),
            longitude: Yup.number().required(),
            about: Yup.string().required().max(300),
            instructions: Yup.string().required(),
            openingHours: Yup.string().required(),
            openOnWeekends: Yup.boolean().required(),
            images: Yup.array(
                Yup.object().shape({
                    path: Yup.string().required(),
                })
            ),
        })

        await schema.validate(orphanageData, {
            abortEarly: false,
        })

        const orphanage = orphanagesRepository.create(orphanageData)

        await orphanagesRepository.save(orphanage)

        return response.status(201).json(orphanage)
    },
}
