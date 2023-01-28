import jwt from 'jsonwebtoken';
import { JwtDTO } from '../../data';

export class JWT {
  public static async sign(payload: string | object, key: jwt.Secret, options: jwt.SignOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, key, options, (err: Error | null, encoded: string | undefined) =>
        err ? reject(err) : resolve(encoded as string)
      );
    });
  }

  public static async verify(token: string, secret: string): Promise<JwtDTO> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => (err ? reject(err) : resolve(decoded as JwtDTO)));
    });
  }
}
