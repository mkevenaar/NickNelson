export class AlreadyExistException extends Error {
  constructor(message, path) {
    super(message);
    this.name = AlreadyExistException.name;
    this.path = path;
  }
}

export class CommandNotFoundException extends Error {
  constructor(message, path) {
    super(message);
    this.name = CommandNotFoundException.name;
    this.path = path;
  }
}

export class InvalidPermissionException extends Error {
  constructor(message, path) {
    super(message);
    this.name = InvalidPermissionException.name;
    this.path = path;
  }
}

export class NotFoundException extends Error {
  constructor(message, path) {
    super(message);
    this.name = NotFoundException.name;
    this.path = path;
  }
}
