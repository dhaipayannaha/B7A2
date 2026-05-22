import express, { type Application, type Request, type Response } from 'express'
import { userService } from './user.service'

const createUser = async (req: Request, res: Response) => {
  // console.log(req.body)
  // const body =req.body
//   const { name, email, password, age } = req.body;

  try {
    const result = await userService.createUserIntoDB(req.body)
    // console.log(result)

    res.status(201).json({
        success: true,
        message:"User registered successfully",
        data: result.rows[0]
      })
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: error
    })
  }
}

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsersFromDB()
      res.status(200).json({
        success: true,
        message:"All users fetched successfully",
        data: result.rows
      })
  } catch (error:any) {
    res.status(500).json({
      message: error.message,
      error: error
    })
  }
}


const getSingleUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.getSingleUserFromDB(Number(id));
        if (result.rows.length === 0) {
          return res.status(404).json({
            success: false,
            message: "User not found"
          })
        }
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: result.rows[0]
    })
  } catch (error:any) {
    res.status(500).json({
      message: error.message,
      error: error
    })
  }
}


const updateUser = async(req:Request, res:Response) => {
    const {id} = req.params;
    const {name, age, password, is_active} = req.body;
    console.log(id, name, age, password, is_active)

    
    
    try {
      const result = await userService.updateUserFromDB(Number(id), req.body);
      
      if(result.rows.length === 0){
        return res.status(404).json({
          success: false,
          message: "User not found"
        })
      }

      res.status(201).json({
        success: true,
        message: "User updated successfully", 
        data: result.rows[0]
      })
    } catch (error:any) {
      res.status(500).json({
        message: error.message,
        error: error
      })
    }
}

export const userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser
}