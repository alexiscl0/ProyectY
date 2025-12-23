from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="carwash"
)

cursor=db.cursor() 

@app.route("/reservar", methods=["POST"])
def reservar():
    try:
        data = request.get_json()
        print("📩 DATOS RECIBIDOS:", data)

        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="carwash"
        )

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
        print("❌ ERROR BACKEND:", e)
        return jsonify({"error": str(e)}), 500




if __name__ == "__main__":
    app.run(debug=True)
