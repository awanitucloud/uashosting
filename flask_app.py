from flask import Flask, render_template

# Nama 'app' ini penting untuk PythonAnywhere
app = Flask(__name__)

@app.route('/')
def index():
    # Flask akan otomatis mencari 'index.html' di dalam folder 'templates'
    return render_template('index.html')

# Baris ini HANYA untuk testing di komputer lokal
# Saat di PythonAnywhere, ini tidak akan dipakai
if __name__ == '__main__':
    app.run(debug=True)