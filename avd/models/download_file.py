import base64
import io

from werkzeug.utils import redirect

from odoo import http
from odoo.http import request
from urllib.parse import unquote

class DownloadFile(http.Controller):

    @http.route([
            '/attachment/download',
        ], type='http', auth='user')
    def download_attachment(self, file_data, file_name, debug=None):
        data = io.BytesIO(base64.standard_b64decode(base64.b64encode(unquote(file_data).encode())))
        return http.send_file(data, filename=file_name, as_attachment=True)
