import e, { Request, Response, NextFunction } from 'express';
import { ServiceError } from "@hotel/helpers"
import AuthenMasterError from '../constants/errors/authen.error.json'
import { MemberModel } from "@hotel/models"
import jwt from 'jsonwebtoken'


const generateMemberId = async (): Promise<string> => {
  const lastMember = await MemberModel.findOne({
    order: [['member_id', 'DESC']]
  })

  if (!lastMember) {
    return 'M000001'
  }

  const lastId = lastMember.member_id
  const numberPart = parseInt(lastId.substring(1))
  const nextNumber = numberPart + 1
  const nextId = `M${nextNumber.toString().padStart(6, '0')}`

  return nextId
}

export const register = () => async (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    last_name: lastName,
    sex,
    phone_number: phoneNumber,
    email,
    password
  } = req.body

  if (!name || !lastName || !sex || !phoneNumber || !email || !password) {
    return next(new ServiceError(AuthenMasterError.ERR_MEMBER_REGISTER_REQUIRED))
  }

  try {
    const existingMember = await MemberModel.findOne({ where: { m_email: email } })
    if (existingMember) {
      return next(new ServiceError(AuthenMasterError.ERR_REGISTER_EMAIL_MEMBER_EXIST))
    }

    const existingPhoneMember = await MemberModel.findOne({ where: { m_tel: phoneNumber } })
    if (existingPhoneMember) {
      return next(new ServiceError(AuthenMasterError.ERR_REGISTER_PHONE_MEMBER_EXIST))
    }

    const memberId = await generateMemberId()

    const newMember = await MemberModel.create({
      member_id: memberId,
      m_firstname: name,
      m_lastname: lastName,
      m_sex: sex,
      m_tel: phoneNumber,
      m_email: email,
      m_password: password
    })

    res.locals.newMember = newMember

    return next()
  } catch (error) {
    next(error)
  }
}

export const login = () => async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new ServiceError(AuthenMasterError.ERR_MEMBER_LOGIN_REQUIRED))
  }

  try {
    const member = await MemberModel.findOne({ where: { m_email: email } })

    if (!member) {
      return next(new ServiceError(AuthenMasterError.ERR_MEMBER_LOGIN_FAIL))
    }


    const isMatch = member.m_password == password
    if (!isMatch) {
      return next(new ServiceError(AuthenMasterError.ERR_MEMBER_LOGIN_FAIL))
    }

    const accessToken = jwt.sign(
      {
        id: member.member_id,
        email: member.m_email,
        role: 'member'
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    )

    res.locals.token = accessToken
    res.locals.member = member
    return next()

  } catch (error) {
    next(error)
  }
}

export const getMe = () => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = res.locals.user
    const member = await MemberModel.findOne({ where: { m_email: email } })

    if (!member) {
      return next(new ServiceError(AuthenMasterError.ERR_MEMBER_LOGIN_FAIL))
    }

    res.locals.member = member
    next()
  } catch (error) {
    next(error)
  }
}

export const updateMe = () => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = res.locals.user;
    const { name, last_name, sex, phone_number, password } = req.body;

    const member = await MemberModel.findByPk(id);

    if (!member) {
      return next(new ServiceError(AuthenMasterError.ERR_MEMBER_LOGIN_FAIL));
    }

    const updates: any = {};
    if (name !== undefined) updates.m_firstname = name;
    if (last_name !== undefined) updates.m_lastname = last_name;
    if (sex !== undefined) updates.m_sex = sex;
    if (phone_number !== undefined) updates.m_tel = phone_number;
    if (password !== undefined && password !== '') updates.m_password = password;

    await member.update(updates);

    res.locals.member = member;
    next();
  } catch (error) {
    next(error);
  }
}