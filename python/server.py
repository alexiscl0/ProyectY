from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import os

app = Flask(__name__)
CORS(app)

def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("MYSQLHOST"),
        user=os.getenv("MYSQLUSER"),
        password=os.getenv("MYSQLPASSWORD"),
        database=os.getenv("MYSQLDATABASE"),
        port=int(os.getenv("MYSQLPORT"))
    )

@app.route("/test-db")
def test_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT 1")
    cursor.close()
    conn.close()
    return "DB OK"

@app.route("/reservar", methods=["POST"])
def reservar():
    try:
        data = request.get_json()

        conn = get_db_connection()
        cursor = conn.cursor()

        sql = """
        INSERT INTO reservas
        (paquete, precio, fecha, hora, nombre, telefono, email, vehiculo, modelo, comentarios)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """

        cursor.execute(sql, (
            data["paquete"],
            data["precio"],
            data["fecha"],
            data["hora"],
            data["nombre"],
            data["telefono"],
            data["email"],
            data["vehiculo"],
            data["modelo"],
            data.get("comentarios", "")
        ))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"mensaje": "Reserva guardada correctamente"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run()
