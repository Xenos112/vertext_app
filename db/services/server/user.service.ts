import UserRepository from "@/db/repositories/user.repository";
import tryCatch from "@/utils/tryCatch";
import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import generateToken from "@/utils/generate-token";
import { cookies } from "next/headers";
import validateAuth from "@/utils/validateAuth";
import UserValidators from "../validators/user.validator";
import { type } from "arktype";
import type {
  UserLoginData,
  UserRegisterData,
} from "@/db/services/validators/user.validator";
import type { UserUpdateData } from "@/db/services/validators/user.validator";

async function getUser(
  _req: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  const { data: user, error } = await tryCatch(UserRepository.getUserById(id));
  if (!id)
    return NextResponse.json({ error: "User id is required" }, { status: 400 });
  if (error)
    return NextResponse.json(
      { error: "Failed to fetch the user" },
      { status: 400 },
    );
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 401 });

  return NextResponse.json({ user });
}

async function register(req: NextRequest) {
  const cookieStore = await cookies();
  const jsonData = (await req.json()) as UserRegisterData;
  const userData = UserValidators.REGISTER_VALIDATOR(jsonData);
  if (userData instanceof type.errors)
    return NextResponse.json({ error: userData.summary }, { status: 400 });

  const { data: oldUser, error: oldUserError } = await tryCatch(
    UserRepository.getUserByEmail(userData.email),
  );

  if (oldUser)
    return NextResponse.json({ error: "User already exists" }, { status: 400 });

  if (oldUserError)
    return NextResponse.json(
      { error: "Failed to Validate Email" },
      { status: 400 },
    );

  const hashedPassword = await bcrypt.hash(userData.password as string, 10);
  userData.password = hashedPassword;
  const { data: newUser, error } = await tryCatch(
    UserRepository.createUser(userData),
  );
  if (error || !newUser)
    return NextResponse.json(
      { error: "Failed to create the user" },
      { status: 400 },
    );

  const token = generateToken(newUser.id as string);
  cookieStore.set("auth_token", token, {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.json({ user: newUser });
}

async function login(req: NextRequest) {
  const cookieStore = await cookies();
  const jsonData = (await req.json()) as UserLoginData;

  const userData = UserValidators.LOGIN_VALIDATOR(jsonData);
  if (userData instanceof type.errors)
    return NextResponse.json({ error: userData.summary }, { status: 400 });

  const { data: user, error: userFetchError } = await tryCatch(
    UserRepository.getUserByEmail(userData.email, false),
  );

  if (userFetchError)
    return NextResponse.json(
      { error: "Failed to fetch the user" },
      { status: 400 },
    );
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 401 });

  const { data: passwordMatch, error: passwordCompareError } = await tryCatch(
    bcrypt.compare(userData.password, user.password as string),
  );
  if (passwordCompareError)
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });

  if (!passwordMatch)
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });

  const token = generateToken(user.id as string);

  console.log(token);
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
  return NextResponse.json({
    token,
    user,
  });
}

async function deleteUser(
  _req: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  if (!id)
    return NextResponse.json({ error: "User id is required" }, { status: 400 });

  const { data: deletedUser, error } = await tryCatch(
    UserRepository.deleteUser(id),
  );
  if (error || !deletedUser)
    return NextResponse.json(
      { error: "Failed to delete the user" },
      { status: 400 },
    );

  return NextResponse.json({ user: deletedUser });
}

async function updateUser(req: NextRequest) {
  const { data: authedUser, error: authedUserError } =
    await tryCatch(validateAuth());
  if (authedUserError)
    return NextResponse.json(
      { error: authedUserError?.message },
      { status: 401 },
    );

  const jsonData = (await req.json()) as UserUpdateData;
  const userData = UserValidators.UPDATE_USER_VALIDATOR(jsonData);
  if (userData instanceof type.errors)
    return NextResponse.json({ error: userData.summary }, { status: 400 });

  const { data: user, error: userError } = await tryCatch(
    UserRepository.getUserById(authedUser.id),
  );
  if (userError)
    return NextResponse.json(
      { error: "Failed to fetch the user" },
      { status: 400 },
    );

  if (userData.tag && userData.tag !== user?.tag) {
    const { data: userWithSameTag, error: userWithSameTagError } =
      await tryCatch(UserRepository.getUserByTag(userData.tag!));
    if (userWithSameTagError)
      return NextResponse.json(
        { error: "Failed to fetch the user" },
        { status: 400 },
      );
    if (userWithSameTag)
      return NextResponse.json(
        { error: "User with same tag already exists" },
        { status: 400 },
      );
  }

  const { data: updatedUser, error } = await tryCatch(
    UserRepository.updateUser(authedUser.id, userData),
  );
  if (error || !updatedUser)
    return NextResponse.json(
      { error: "Failed to update the user" },
      { status: 400 },
    );

  return NextResponse.json({ user: updatedUser });
}

async function getMe() {
  const { data: authedUser, error: authedUserError } =
    await tryCatch(validateAuth());
  if (authedUserError) return NextResponse.json({ me: null });

  return NextResponse.json({ me: authedUser });
}

const UserService = {
  getUser,
  register,
  deleteUser,
  updateUser,
  login,
  getMe,
};

export default UserService;
