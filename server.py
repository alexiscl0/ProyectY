from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import mysql.connector

app = Flask(__name__)
CORS(app)

MYSQL_CONFIG = {
    "host": os.environ["MYSQLHOST"],
    "user": os.environ["MYSQLUSER"],
    "password": os.environ["MYSQLPASSWORD"],
    "port": int(os.environ["MYSQLPORT"])
}

DB_NAME = "carwash"

def init_db():
    conn = mysql.connector.connect(**MYSQL_CONFIG)
    cursor = conn.cursor()

    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
    cursor.execute(f"USE {DB_NAME}")

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS reservas (
            id INT AUTO_INCREMENT PRIMARY KEY,
            paquete VARCHAR(50),
            precio INT,
            fecha DATE,
            hora TIME,
            nombre VARCHAR(100),
            telefono VARCHAR(20),
            email VARCHAR(100),
            vehiculo VARCHAR(50),
            modelo VARCHAR(50),
            comentarios TEXT,
            creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    cursor.close()
    conn.close()

@app.route("/reservar", methods=["POST"])
def reservar():
    try:
        data = request.get_json()

        conn = mysql.connector.connect(**MYSQL_CONFIG, database=DB_NAME)
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

@app.route("/test-db")
def test_db():
    try:
        conn = mysql.connector.connect(**MYSQL_CONFIG, database=DB_NAME)
        conn.close()
        return "DB OK", 200
    except Exception as e:
        return f"DB ERROR: {e}", 500

if __name__ == "__main__":
    init_db()
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
