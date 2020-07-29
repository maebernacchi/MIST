/**
 * MIST is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// +-----------+---------------------
// | Utilities |
// +-----------+

// These are useful functions that don't belong to any 
// particular file.


/**
 * Download something.
 *
 * Based on http://html5-demos.appspot.com/static/a.download.html
 */
export function download(fname, type, content) {
    // Get our download link
    var link = document.getElementById("mist-downloader");
    if (!link) {
        link = document.createElement("a");
        link.id = "mist-downloader";
        document.body.appendChild(link);
    }

    // Set up where to download
    link.download = fname;

    // Build a blob
    var blob = new Blob([content], { type: type });

    // Build a link to the blob
    link.href = window.URL.createObjectURL(blob);

    // I think this just makes it easier to drag the link to the desktop,
    // but I could be wrong.  (Since we're not showing the link, it's
    // probably irrelevant.  But we might show the link later.)
    link.dataset.downloadurl = [type, link.download, link.href].join(':');

    // Click the link to trigger the save.
    link.click();
} // download