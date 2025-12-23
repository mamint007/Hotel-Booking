import { sequelize } from "@hotel/models";

// import winston from './winston'

const databaseConnect = async () => {
  try {
    await sequelize.authenticate()
    console.log('Database connected')
  } catch (error) {
    console.log('Unable to connect database', JSON.stringify(error))
    throw error
  }
}
export default databaseConnect