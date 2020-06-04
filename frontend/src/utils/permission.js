import { ROLES } from '../constants/roles';

export const isUser = user => {
  return user.role === ROLES.USER;
};

export const isOwner = user => {
  return user.role === ROLES.OWNER;
};

export const isAdmin = user => {
  return user.role === ROLES.ADMIN;
};

export const isOwnerOrAdmin = user => {
  return user.role === ROLES.ADMIN || user.role === ROLES.OWNER;
};

export const isOwnerOrUser = user => {
  return user.role === ROLES.OWNER || user.role === ROLES.USER;
};
