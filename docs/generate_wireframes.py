import json
import uuid

def create_element(type, x, y, width, height, text=None, text_y_offset=0):
    element_id = str(uuid.uuid4())
    element = {
        "id": element_id,
        "type": type,
        "x": x,
        "y": y,
        "width": width,
        "height": height,
        "angle": 0,
        "strokeColor": "#1e1e1e",
        "backgroundColor": "transparent",
        "fillStyle": "solid",
        "strokeWidth": 2,
        "strokeStyle": "solid",
        "roughness": 1,
        "opacity": 100,
        "groupIds": [],
        "frameId": None,
        "roundness": None if type == "text" else {"type": 3},
        "seed": 1,
        "version": 1,
        "versionNonce": 1,
        "isDeleted": False,
        "boundElements": None,
        "updated": 1,
        "link": None,
        "locked": False
    }
    
    if type == "text" and text:
        element.update({
            "text": text,
            "fontSize": 20,
            "fontFamily": 5,
            "textAlign": "center",
            "verticalAlign": "middle",
            "baseline": 18
        })
    elif text:
        text_id = str(uuid.uuid4())
        text_element = {
            "id": text_id,
            "type": "text",
            "x": x + width / 2 - (len(text.split('\n')[0]) * 5),
            "y": y + height / 2 - 10 + text_y_offset,
            "width": max([len(line) for line in text.split('\n')]) * 10,
            "height": 20 * len(text.split('\n')),
            "angle": 0,
            "strokeColor": "#1e1e1e",
            "backgroundColor": "transparent",
            "fillStyle": "solid",
            "strokeWidth": 2,
            "strokeStyle": "solid",
            "roughness": 1,
            "opacity": 100,
            "groupIds": [],
            "frameId": None,
            "roundness": None,
            "seed": 1,
            "version": 1,
            "versionNonce": 1,
            "isDeleted": False,
            "boundElements": None,
            "updated": 1,
            "link": None,
            "locked": False,
            "text": text,
            "fontSize": 20,
            "fontFamily": 5,
            "textAlign": "center",
            "verticalAlign": "middle",
            "baseline": 18,
            "containerId": element_id
        }
        element["boundElements"] = [{"id": text_id, "type": "text"}]
        return [element, text_element]
    
    return [element]

def create_arrow(x1, y1, x2, y2):
    return {
        "id": str(uuid.uuid4()),
        "type": "arrow",
        "x": x1,
        "y": y1,
        "width": abs(x2 - x1),
        "height": abs(y2 - y1),
        "angle": 0,
        "strokeColor": "#1e1e1e",
        "backgroundColor": "transparent",
        "fillStyle": "solid",
        "strokeWidth": 2,
        "strokeStyle": "solid",
        "roughness": 1,
        "opacity": 100,
        "groupIds": [],
        "frameId": None,
        "roundness": {"type": 2},
        "seed": 1,
        "version": 1,
        "versionNonce": 1,
        "isDeleted": False,
        "boundElements": None,
        "updated": 1,
        "link": None,
        "locked": False,
        "points": [[0, 0], [x2 - x1, y2 - y1]]
    }

# Architecture Diagram
elements_arch = []
# Root
elements_arch.extend(create_element("rectangle", 400, 50, 200, 60, "Nipro Website"))

# Level 1
pages = ["Homepage", "Courses", "Verify Certificate", "Blog/News", "Contact Us", "Admin Panel"]
for i, page in enumerate(pages):
    x = 50 + i * 150
    y = 200
    elements_arch.extend(create_element("rectangle", x, y, 140, 60, page))
    elements_arch.append(create_arrow(500, 110, x + 70, y))

# Level 2 Admin
admin_sub = ["Manage Courses", "Manage Certs", "Manage Content"]
for i, sub in enumerate(admin_sub):
    x = 550 + i * 150
    y = 350
    elements_arch.extend(create_element("rectangle", x, y, 140, 60, sub))
    elements_arch.append(create_arrow(870, 260, x + 70, y))

with open('c:/Users/techt/Nipro/nipro-site-architecture.excalidraw', 'w') as f:
    json.dump({"type": "excalidraw", "version": 2, "source": "https://excalidraw.com", "elements": elements_arch, "appState": {"viewBackgroundColor": "#ffffff", "gridSize": 20}}, f)

# Homepage Wireframe
elements_home = []
elements_home.extend(create_element("rectangle", 100, 50, 800, 60, "Header (Logo + Navigation)"))
elements_home.extend(create_element("rectangle", 100, 130, 800, 200, "Hero Section\n'Practical Computer Training'\nButtons: Call Now, WhatsApp"))
elements_home.extend(create_element("rectangle", 100, 350, 800, 120, "Trust Stats\n(1000+ Students, 15+ Courses, Gov Recog)"))
elements_home.extend(create_element("rectangle", 100, 490, 800, 250, "Courses Categories Grid\n(Computer Basics, Accounting, Design, etc.)"))
elements_home.extend(create_element("rectangle", 100, 760, 800, 150, "Certificate Verification Block\n(Enter ID / Name)"))
elements_home.extend(create_element("rectangle", 100, 930, 800, 200, "Why Choose Us / FAQ Accordion"))
elements_home.extend(create_element("rectangle", 100, 1150, 800, 100, "Footer\n(Links, Contact, Copyright)"))

with open('c:/Users/techt/Nipro/nipro-homepage-wireframe.excalidraw', 'w') as f:
    json.dump({"type": "excalidraw", "version": 2, "source": "https://excalidraw.com", "elements": elements_home, "appState": {"viewBackgroundColor": "#ffffff", "gridSize": 20}}, f)

# Admin Dashboard Wireframe
elements_admin = []
elements_admin.extend(create_element("rectangle", 100, 50, 200, 600, "Sidebar\n- Dashboard\n- Certificates\n- Courses\n- Blog\n- Settings"))
elements_admin.extend(create_element("rectangle", 320, 50, 580, 60, "Topbar (User Profile, Logout)"))
elements_admin.extend(create_element("rectangle", 320, 130, 580, 520, "Content Area\n(Data Tables, Forms for Add/Edit)"))

with open('c:/Users/techt/Nipro/nipro-admin-wireframe.excalidraw', 'w') as f:
    json.dump({"type": "excalidraw", "version": 2, "source": "https://excalidraw.com", "elements": elements_admin, "appState": {"viewBackgroundColor": "#ffffff", "gridSize": 20}}, f)

print("Excalidraw files generated successfully!")
