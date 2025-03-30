const API_URL = "http://localhost:9000";

// Carregar Status
function loadStatus() {
    $.get(`${API_URL}/status`, function(status) {
        statusList = status;
        $("#task-status").empty();
        status.forEach(status => {
            $("#task-status").append(`<option value="${status.id}">${status.name}</option>`);
        });
    });
}

// Carregar tarefas
function loadTasks() {
    $.get(`${API_URL}/tasks`, function(tasks) {
        console.log("Tarefas recebidas:", tasks); 
        $("#task-list").empty();
        
        if (Array.isArray(tasks) && tasks.length > 0) {
            tasks.forEach(task => {
                const status = task.Status ? task.Status.name : 'Indefinido';
                let statusBadgeClass;

                if (status === 'concluída') {
                    statusBadgeClass = 'bg-success'; 
                } else if (status === 'pendente') {
                    statusBadgeClass = 'bg-warning';
                } else if (status === 'em andamento') {
                    statusBadgeClass = 'bg-primary';
                } else {
                    statusBadgeClass = 'bg-secondary';
                }

                $("#task-list").append(`
                    <tr data-id="${task.id}" data-statusid="${task.statusId}">
                        <td class="text-center">${task.title}</td>
                        <td class="text-center">${task.description || "Sem descrição"}</td>
                        <td class="text-center">
                            <span class="badge ${statusBadgeClass}">
                                ${status}
                            </span>
                        </td>
                        <td class="text-center">
                            <button class="btn btn-warning btn-sm edit-task">
                                <i class="bi bi-pencil-square"></i> Editar
                            </button>
                            <button class="btn btn-danger btn-sm delete-task">
                                <i class="bi bi-trash"></i> Excluir
                            </button>
                            <button class="btn btn-success btn-sm toggle-status">
                                <i class="bi ${status === "concluída" ? "bi-arrow-counterclockwise" : "bi-check-lg"}"></i> 
                                ${status === "concluída" ? "Reabrir" : "Concluir"}
                            </button>
                        </td>
                    </tr>
                `);
            });
        } else {
            console.log("Nenhuma tarefa encontrada.");
            $("#task-list").append(`
                <tr>
                    <td colspan="4" class="text-center">Nenhuma tarefa encontrada.</td>
                </tr>
            `);
        }
    }).fail(function(xhr) {
        console.error("Erro ao carregar tarefas:", xhr.responseText);
        $("#task-list").append(`
            <tr>
                <td colspan="4" class="text-center text-danger">Erro ao carregar tarefas. Tente novamente mais tarde.</td>
            </tr>
        `);
    });
}

// Criar/Atualizar Tarefa
$("#task-form").submit(function(event) {
    event.preventDefault();
    const id = $("#task-id").val();
    const taskData = {
        title: $("#task-title").val(),
        description: $("#task-description").val(),
        statusId: $("#task-status").val(),
    };

    const requestType = id ? "PUT" : "POST";
    const requestUrl = id ? `${API_URL}/tasks/${id}` : `${API_URL}/tasks`;

    $.ajax({
        url: requestUrl,
        type: requestType,
        contentType: "application/json",
        data: JSON.stringify(taskData),
        success: loadTasks,
    });

    $(this).trigger("reset");
    $("#task-id").val("");
});

// Editar Tarefa
$(document).on("click", ".edit-task", function() {
    const row = $(this).closest("tr");
    const taskId = row.data("id");
    const taskTitle = row.find("td:eq(0)").text();
    const taskDescription = row.find("td:eq(1)").text();
    const taskStatusId = row.data("statusid");

    $("#task-id").val(taskId);
    $("#task-title").val(taskTitle);
    $("#task-description").val(taskDescription);

    $("#task-status").val(taskStatusId);
});


// Excluir Tarefa
$(document).on("click", ".delete-task", function() {
    const id = $(this).closest("tr").data("id");

    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) {
        return;
    }

    $.ajax({
        url: `${API_URL}/tasks/${id}`,
        type: "DELETE",
        success: loadTasks,
        error: function(xhr) { console.error("Erro ao excluir:", xhr.responseText); }
    });
});

// Alterar Status
$(document).on("click", ".toggle-status", function() {
    const row = $(this).closest("tr");
    const id = row.data("id");
    const currentStatusId = row.data("statusid");
    let newStatusId;

    if (currentStatusId === 3) {
        newStatusId = 1;
    } else {
        newStatusId = 3;
    }

    $.ajax({
        url: `${API_URL}/tasks/${id}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({ statusId: newStatusId }), 
        success: loadTasks,
        error: function(xhr) { console.error("Erro ao atualizar status:", xhr.responseText); }
    });
});

$(document).ready(loadStatus);
$(document).ready(loadTasks);
